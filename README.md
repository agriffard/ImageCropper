# ImageCropper

[![NuGet](https://img.shields.io/nuget/v/ImageCropper.svg)](https://www.nuget.org/packages/ImageCropper)
[![CI](https://github.com/agriffard/ImageCropper/actions/workflows/ci.yml/badge.svg)](https://github.com/agriffard/ImageCropper/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/agriffard/ImageCropper/actions/workflows/pages.yml/badge.svg)](https://github.com/agriffard/ImageCropper/actions/workflows/pages.yml)

`ImageCropper` is a .NET 10 Blazor component library for avatar and upload flows.

It supports:
- crop
- rotate
- zoom
- aspect-ratio lock
- blob output (plus .NET callback payload)

## Install

```bash
dotnet add package ImageCropper
```

## Basic usage

```razor
@using ImageCropper

<ImageCropperComponent ImageUrl="@ImageUrl"
              AspectRatioLocked="true"
              AspectRatio="1"
              OnImageCropped="OnCropped" />

@code {
    private string? ImageUrl;

    private Task OnCropped(CroppedImageResult result)
    {
        // result.Bytes, result.MimeType, result.BlobUrl, result.Width, result.Height
        return Task.CompletedTask;
    }
}
```

## Project layout

- `src/ImageCropper`: NuGet-ready Blazor component library (`net10.0`)
- `samples/ImageCropper.Sample`: Blazor WebAssembly sample app
- `docs`: short usage docs for GitHub Pages/readers

## Run sample locally

```bash
dotnet run --project samples/ImageCropper.Sample/ImageCropper.Sample.csproj
```

## Build package locally

```bash
dotnet pack src/ImageCropper/ImageCropper.csproj -c Release
```
