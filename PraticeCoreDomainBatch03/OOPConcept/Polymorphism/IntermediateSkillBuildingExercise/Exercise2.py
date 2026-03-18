from abc import ABC, abstractmethod

# =================================================
# Base Class / Interface
# =================================================
class ImageFilter(ABC):
    """
    Base interface for all image filters.
    Any new filter must implement the process() method.
    """

    @abstractmethod
    def process(self, image):
        pass


# =================================================
# Concrete Filter Implementations
# =================================================
class BlurFilter(ImageFilter):
    def process(self, image):
        print(f"Applying BLUR filter on {image}")


class SharpenFilter(ImageFilter):
    def process(self, image):
        print(f"Applying SHARPEN filter on {image}")


class GrayscaleFilter(ImageFilter):
    def process(self, image):
        print(f"Applying GRAYSCALE filter on {image}")


# =================================================
# Core Image Processing Engine
# =================================================
class ImageProcessor:
    """
    Core processor that applies any filter.
    This class NEVER changes when new filters are added.
    """

    def apply_filter(self, image, image_filter: ImageFilter):
        image_filter.process(image)


# =================================================
# Main Program (Demonstration of Polymorphism)
# =================================================
if __name__ == "__main__":

    image = "sample_image.jpg"

    # List of filters (polymorphism in action)
    filters = [
        BlurFilter(),
        SharpenFilter(),
        GrayscaleFilter()
    ]

    processor = ImageProcessor()

    for f in filters:
        processor.apply_filter(image, f)
