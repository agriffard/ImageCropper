# ImageCropper docs

ImageCropper is a Blazor component for crop/rotate/zoom with aspect-ratio lock and blob export.

## Demo

Use the sample app in `samples/ImageCropper.Sample` to test upload/avatar flows.

## Parameters

- `ImageUrl`: image source URL/data URL
- `Zoom`: zoom factor (default `1`)
- `Rotation`: rotation degrees (default `0`)
- `AspectRatioLocked`: lock crop to `AspectRatio`
- `AspectRatio`: width/height ratio when lock is enabled
- `OutputMimeType`: blob MIME type for export
- `OutputQuality`: output quality used by canvas blob encoder
- `OnImageCropped`: callback returning `CroppedImageResult`
