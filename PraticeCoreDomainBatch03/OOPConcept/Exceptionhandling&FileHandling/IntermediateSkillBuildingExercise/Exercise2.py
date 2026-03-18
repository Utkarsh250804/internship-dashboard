# =================================================
# Custom Exception
# =================================================
class EmptyFileError(Exception):
    pass


# =================================================
# File Processing Function
# =================================================
def process_files(file_list):

    for filename in file_list:
        try:
            with open(filename, "r") as file:
                first_line = file.readline()

                if first_line == "":
                    raise EmptyFileError(f"{filename} is empty")

                print(f"{filename}: {first_line.strip()}")

        except FileNotFoundError:
            print(f"{filename} not found")

        except EmptyFileError as e:
            print("Error:", e)

        except Exception as e:
            print("Unexpected error:", e)


# =================================================
# Main Program
# =================================================
if __name__ == "__main__":

    files = [
        "file1.txt",   # may exist with content
        "file2.txt",   # may be empty
        "file3.txt"    # may not exist
    ]

    process_files(files)
