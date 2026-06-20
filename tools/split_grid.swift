import Foundation
import ImageIO
import CoreGraphics
import UniformTypeIdentifiers

struct CLIError: Error, CustomStringConvertible {
  let description: String
}

func savePNG(_ image: CGImage, to url: URL) throws {
  guard let destination = CGImageDestinationCreateWithURL(
    url as CFURL,
    UTType.png.identifier as CFString,
    1,
    nil
  ) else {
    throw CLIError(description: "Could not create destination for \(url.path)")
  }

  CGImageDestinationAddImage(destination, image, nil)

  if !CGImageDestinationFinalize(destination) {
    throw CLIError(description: "Could not finalize image at \(url.path)")
  }
}

let args = CommandLine.arguments

guard args.count >= 6 else {
  throw CLIError(
    description: "Usage: swift tools/split_grid.swift <input> <rows> <cols> <output_dir> <prefix>"
  )
}

let inputPath = args[1]
guard let rows = Int(args[2]), rows > 0 else {
  throw CLIError(description: "Rows must be a positive integer.")
}

guard let cols = Int(args[3]), cols > 0 else {
  throw CLIError(description: "Cols must be a positive integer.")
}

let outputDirectory = URL(fileURLWithPath: args[4], isDirectory: true)
let prefix = args[5]

try FileManager.default.createDirectory(
  at: outputDirectory,
  withIntermediateDirectories: true
)

let inputURL = URL(fileURLWithPath: inputPath)

guard let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
  throw CLIError(description: "Could not load image at \(inputPath)")
}

let width = image.width
let height = image.height

for row in 0..<rows {
  for col in 0..<cols {
    let x0 = Int((Double(col) * Double(width)) / Double(cols))
    let x1 = Int((Double(col + 1) * Double(width)) / Double(cols))
    let top0 = Int((Double(row) * Double(height)) / Double(rows))
    let top1 = Int((Double(row + 1) * Double(height)) / Double(rows))

    let cropWidth = x1 - x0
    let cropHeight = top1 - top0
    let originY = height - top1

    let rect = CGRect(x: x0, y: originY, width: cropWidth, height: cropHeight)

    guard let crop = image.cropping(to: rect) else {
      throw CLIError(description: "Could not crop row \(row) col \(col)")
    }

    let fileURL = outputDirectory.appendingPathComponent("\(prefix)-r\(row + 1)c\(col + 1).png")
    try savePNG(crop, to: fileURL)
  }
}
