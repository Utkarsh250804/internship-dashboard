import time

def write_log(message):
    attempts = 0

    while attempts < 3:
        try:
            with open("app.log", "a") as file:
                file.write(message + "\n")
            print("Log written to app.log")
            return
        except IOError:
            attempts += 1
            time.sleep(0.5)

    with open("backup.log", "a") as backup:
        backup.write(message + "\n")
    print("Primary log failed. Written to backup.log")


if __name__ == "__main__":
    write_log("Application started successfully")
