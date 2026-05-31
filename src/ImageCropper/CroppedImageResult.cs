namespace ImageCropper;

public sealed record CroppedImageResult(
    byte[] Bytes,
    string MimeType,
    string BlobUrl,
    int Width,
    int Height,
    long Size);
