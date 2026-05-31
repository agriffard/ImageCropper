using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace ImageCropper;

public partial class ImageCropperComponent : ComponentBase
{
    [Inject] private IJSRuntime JsRuntime { get; set; } = default!;

    [Parameter] public string? ImageUrl { get; set; }
    [Parameter] public int CanvasWidth { get; set; } = 320;
    [Parameter] public int CanvasHeight { get; set; } = 320;
    [Parameter] public double Zoom { get; set; } = 1;
    [Parameter] public double Rotation { get; set; }
    [Parameter] public bool AspectRatioLocked { get; set; } = true;
    [Parameter] public double AspectRatio { get; set; } = 1;
    [Parameter] public string OutputMimeType { get; set; } = "image/png";
    [Parameter] public double OutputQuality { get; set; } = 0.92;
    [Parameter] public EventCallback<CroppedImageResult> OnImageCropped { get; set; }

    private ElementReference _canvas;
    private IJSObjectReference? _module;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            _module = await JsRuntime.InvokeAsync<IJSObjectReference>("import", "./_content/ImageCropper/imageCropper.js");
        }

        await RenderAsync();
    }

    protected override async Task OnParametersSetAsync() => await RenderAsync();

    private async Task RenderAsync()
    {
        if (_module is null)
        {
            return;
        }

        await _module.InvokeVoidAsync(
            "render",
            _canvas,
            ImageUrl,
            Zoom,
            Rotation,
            AspectRatio,
            AspectRatioLocked);
    }

    public async Task ExportAsync()
    {
        if (_module is null || string.IsNullOrWhiteSpace(ImageUrl))
        {
            return;
        }

        var jsResult = await _module.InvokeAsync<JsExportResult>(
            "exportBlob",
            _canvas,
            OutputMimeType,
            OutputQuality,
            AspectRatio,
            AspectRatioLocked);

        var result = new CroppedImageResult(
            Convert.FromBase64String(jsResult.Base64),
            jsResult.MimeType,
            jsResult.BlobUrl,
            jsResult.Width,
            jsResult.Height,
            jsResult.Size);

        if (OnImageCropped.HasDelegate)
        {
            await OnImageCropped.InvokeAsync(result);
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_module is not null)
        {
            await _module.DisposeAsync();
        }
    }

    private sealed class JsExportResult
    {
        public string Base64 { get; set; } = string.Empty;
        public string MimeType { get; set; } = "image/png";
        public string BlobUrl { get; set; } = string.Empty;
        public int Width { get; set; }
        public int Height { get; set; }
        public long Size { get; set; }
    }
}
