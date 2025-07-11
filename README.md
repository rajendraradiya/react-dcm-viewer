# React DICOM Viewer Examples

This project demonstrates how to build DICOM file viewers in React using three different libraries:

1. **[Cornerstone](https://github.com/cornerstonejs/cornerstone)**
2. **[Cornerstone3D](https://github.com/cornerstonejs/cornerstone3D)**
3. **[DWV (DICOM Web Viewer)](https://github.com/ivmartel/dwv)**

Each viewer is implemented as a standalone example to show different ways to load and render `.dcm` (DICOM) medical images in a modern React application.

---

## 🔧 Project Structure

- `/cornerstone-viewer`: Viewer built using `cornerstone-core` and related packages.
- `/cornerstone3d-viewer`: Viewer using the newer `cornerstone3D` rendering engine.
- `/dwv-viewer`: Viewer based on the `dwv` (DICOM Web Viewer) library.

---

## 📁 Supported DICOM Features

Each example app supports basic DICOM image viewing features like:

- Loading `.dcm` files
- Rendering grayscale medical images
- Zooming and panning
- Basic image controls (e.g. brightness/contrast) *(varies by library)*

---

## ▶️ How to Run

Install dependencies:

```bash
npm install
