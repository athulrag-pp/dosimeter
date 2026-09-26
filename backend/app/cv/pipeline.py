import cv2
import numpy as np
import base64
import math
from typing import Dict, Any, Tuple, List
from app.schemas.schemas import ImageQualityCheck, ColorFeatures

# Reference Baseline for unexposed Copper colorimetric strip in CIE Lab space
# Unexposed strip is light tan/pinkish-copper (e.g. RGB ~(215, 175, 150)) -> Lab ~(74, 13, 18)
BASELINE_LAB = (74.0, 13.0, 18.0)

def calculate_delta_e_76(lab1: Tuple[float, float, float], lab2: Tuple[float, float, float]) -> float:
    """Calculate CIE76 Delta E color difference between two Lab colors."""
    dL = lab1[0] - lab2[0]
    da = lab1[1] - lab2[1]
    db = lab1[2] - lab2[2]
    return math.sqrt(dL * dL + da * da + db * db)

def base64_to_cv2(b64_str: str) -> np.ndarray:
    """Decode base64 image string (with or without data URL header) into OpenCV BGR numpy array."""
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    img_bytes = base64.b64decode(b64_str)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image from base64 string")
    return img

def cv2_to_base64(img: np.ndarray) -> str:
    """Encode OpenCV BGR image to base64 string with PNG header."""
    _, buffer = cv2.imencode(".png", img)
    b64_bytes = base64.b64encode(buffer)
    return f"data:image/png;base64,{b64_bytes.decode('utf-8')}"

def normalize_lighting(bgr_img: np.ndarray, reference_patch_rgb: Tuple[float, float, float] = (240, 240, 240)) -> np.ndarray:
    """White balance & brightness normalization using reference white patch if available."""
    lab = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    # CLAHE (Contrast Limited Adaptive Histogram Equalization) on L channel
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l_norm = clahe.apply(l)
    
    normalized_lab = cv2.merge([l_norm, a, b])
    return cv2.cvtColor(normalized_lab, cv2.COLOR_LAB2BGR)

def detect_sensor_roi(bgr_img: np.ndarray) -> Tuple[np.ndarray, Tuple[int, int, int, int], bool]:
    """
    Detect sensor strip Region of Interest (ROI).
    In the frame guide overlay, the strip is central.
    Returns (cropped_roi, (x, y, w, h), strip_detected).
    """
    h, w, _ = bgr_img.shape
    
    # Define central ROI box corresponding to scanner frame guide (40% width, 30% height centered)
    roi_w = int(w * 0.45)
    roi_h = int(h * 0.35)
    start_x = int((w - roi_w) / 2)
    start_y = int((h - roi_h) / 2)
    
    # Crop central region
    roi = bgr_img[start_y:start_y+roi_h, start_x:start_x+roi_w]
    
    # Basic check for valid ROI dimensions and contrast
    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    std_dev = np.std(gray_roi)
    
    # If standard deviation is extremely low, image might be blank/obscured
    strip_detected = std_dev > 8.0
    
    return roi, (start_x, start_y, roi_w, roi_h), strip_detected

def detect_reference_patches(bgr_img: np.ndarray) -> Tuple[Dict[str, Tuple[float, float, float]], bool]:
    """
    Extract reference color patches around the frame.
    Four corner/side patch areas: White, Light Neutral, Dark Neutral, Calibration Reference.
    Returns patch dictionary and detection boolean.
    """
    h, w, _ = bgr_img.shape
    
    # Sub-sample 4 reference regions (top-left, top-right, bottom-left, bottom-right corners)
    size = int(min(h, w) * 0.08)
    margin = int(min(h, w) * 0.05)
    
    tl = bgr_img[margin:margin+size, margin:margin+size]
    tr = bgr_img[margin:margin+size, w-margin-size:w-margin]
    bl = bgr_img[h-margin-size:h-margin, margin:margin+size]
    br = bgr_img[h-margin-size:h-margin, w-margin-size:w-margin]
    
    patches = {
        "patch_1_white": tuple(map(float, cv2.mean(tl)[:3][::-1])), # RGB
        "patch_2_gray": tuple(map(float, cv2.mean(tr)[:3][::-1])),
        "patch_3_dark": tuple(map(float, cv2.mean(bl)[:3][::-1])),
        "patch_4_ref": tuple(map(float, cv2.mean(br)[:3][::-1]))
    }
    
    # Check that corner regions have distinct valid pixels
    detected = all(np.mean(p) > 5 for p in patches.values())
    return patches, detected

def check_image_quality(bgr_img: np.ndarray, roi_detected: bool, ref_detected: bool) -> ImageQualityCheck:
    """Assess brightness, focus sharpness (Laplacian variance), and alignment."""
    gray = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2GRAY)
    
    # Brightness (mean grayscale value)
    mean_brightness = float(np.mean(gray))
    lighting_ok = 35.0 <= mean_brightness <= 240.0
    
    # Focus / Blur check via Laplacian variance
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    focus_ok = laplacian_var >= 25.0
    
    alignment_ok = roi_detected
    overall_valid = lighting_ok and focus_ok and roi_detected and ref_detected
    
    msg = None
    if not lighting_ok:
        msg = "Lighting conditions are not suitable. Move to a well-lit area."
    elif not focus_ok:
        msg = "Image is too blurry. Hold the camera steady and re-focus."
    elif not roi_detected:
        msg = "Sensor strip not detected. Align the wristband inside the guide frame."
    elif not ref_detected:
        msg = "Calibration reference patches not clearly detected."
    else:
        msg = "Optimal image quality for color analysis."
        
    return ImageQualityCheck(
        lighting="GOOD" if lighting_ok else "POOR",
        focus="GOOD" if focus_ok else "POOR",
        alignment="GOOD" if alignment_ok else "POOR",
        strip_detected=roi_detected,
        reference_patches_detected=ref_detected,
        overall_valid=overall_valid,
        message=msg
    )

def extract_color_features(roi_bgr: np.ndarray) -> ColorFeatures:
    """
    Extract RGB, CIE Lab, HSV, Delta E and statistical metrics from ROI.
    """
    # RGB conversion (OpenCV uses BGR)
    roi_rgb = cv2.cvtColor(roi_bgr, cv2.COLOR_BGR2RGB)
    
    mean_rgb = list(map(float, np.mean(roi_rgb, axis=(0, 1))))
    median_rgb = list(map(float, np.median(roi_rgb, axis=(0, 1))))
    
    # Convert ROI to CIE Lab space
    # Scale RGB [0..255] to Lab [0..100, -128..127] standard
    roi_lab = cv2.cvtColor(roi_bgr, cv2.COLOR_BGR2LAB)
    
    # OpenCV Lab L in [0..255], a in [0..255], b in [0..255]
    # Standard Lab: L* in [0..100], a* in [-128..127], b* in [-128..127]
    mean_opencv_lab = np.mean(roi_lab, axis=(0, 1))
    
    l_star = mean_opencv_lab[0] * 100.0 / 255.0
    a_star = mean_opencv_lab[1] - 128.0
    b_star = mean_opencv_lab[2] - 128.0
    mean_lab = [float(l_star), float(a_star), float(b_star)]
    
    # Calculate Delta E against unexposed baseline
    delta_e = calculate_delta_e_76((l_star, a_star, b_star), BASELINE_LAB)
    
    # HSV features for Saturation and Brightness
    roi_hsv = cv2.cvtColor(roi_bgr, cv2.COLOR_BGR2HSV)
    saturation = float(np.mean(roi_hsv[:, :, 1])) / 255.0 * 100.0
    brightness = float(np.mean(roi_hsv[:, :, 2])) / 255.0 * 100.0
    
    # Color variance
    color_variance = float(np.std(roi_rgb))
    
    return ColorFeatures(
        mean_rgb=mean_rgb,
        median_rgb=median_rgb,
        mean_lab=mean_lab,
        delta_e=delta_e,
        saturation=saturation,
        brightness=brightness,
        color_variance=color_variance
    )

def draw_roi_highlights(bgr_img: np.ndarray, roi_rect: Tuple[int, int, int, int], features: ColorFeatures, risk: str) -> np.ndarray:
    """Draw bounding boxes, reference patch indicators, and feature labels on image."""
    annotated = bgr_img.copy()
    x, y, w, h = roi_rect
    
    # Color coding based on risk
    color_map = {
        "SAFE": (105, 180, 5),     # Green BGR
        "ATTENTION": (6, 175, 235),# Amber BGR
        "HIGH": (12, 110, 240),    # Orange BGR
        "CRITICAL": (38, 38, 220)  # Red BGR
    }
    box_color = color_map.get(risk, (235, 150, 25))
    
    # Main Sensor ROI rectangle
    cv2.rectangle(annotated, (x, y), (x + w, y + h), box_color, 3)
    
    # Label ROI
    cv2.putText(annotated, f"H2S SENSOR ROI | Delta E: {features.delta_e:.1f}", (x, max(y - 10, 25)),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, box_color, 2)
                
    # Corner reference patch indicators
    img_h, img_w, _ = bgr_img.shape
    size = int(min(img_h, img_w) * 0.08)
    margin = int(min(img_h, img_w) * 0.05)
    
    corners = [
        (margin, margin, "REF 1 (W)"),
        (img_w - margin - size, margin, "REF 2 (G)"),
        (margin, img_h - margin - size, "REF 3 (D)"),
        (img_w - margin - size, img_h - margin - size, "REF 4 (C)")
    ]
    
    for (cx, cy, label) in corners:
        cv2.rectangle(annotated, (cx, cy), (cx + size, cy + size), (255, 255, 255), 1)
        cv2.putText(annotated, label, (cx, cy + size + 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (220, 220, 220), 1)
        
    return annotated

def process_sensor_image(b64_image: str) -> Dict[str, Any]:
    """
    Complete CV Pipeline:
    1. Decode Base64 -> BGR
    2. Detect Sensor ROI & Reference Patches
    3. Perform Image Quality Checks
    4. Lighting & Color Normalization
    5. Convert to CIE Lab & Extract Features
    6. Generate Annotated Overlay Image
    """
    raw_bgr = base64_to_cv2(b64_image)
    
    # Detect ROI & Reference Patches
    roi_bgr, roi_rect, roi_detected = detect_sensor_roi(raw_bgr)
    ref_patches, ref_detected = detect_reference_patches(raw_bgr)
    
    # Quality Check
    quality_checks = check_image_quality(raw_bgr, roi_detected, ref_detected)
    
    # Normalize image
    norm_bgr = normalize_lighting(raw_bgr)
    norm_roi = norm_bgr[roi_rect[1]:roi_rect[1]+roi_rect[3], roi_rect[0]:roi_rect[0]+roi_rect[2]]
    
    # Extract Features
    features = extract_color_features(norm_roi if roi_detected else raw_bgr)
    
    return {
        "raw_bgr": raw_bgr,
        "roi_bgr": roi_bgr,
        "roi_rect": roi_rect,
        "ref_patches": ref_patches,
        "quality_checks": quality_checks,
        "features": features
    }
