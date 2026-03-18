def upload(data):
    if not isinstance(data, (int, float)):
        raise TypeError("Only numeric data is allowed for upload")

    print(f"Uploading: {data}")


# Usage
upload(100)        # int
upload(45.67)      # float


