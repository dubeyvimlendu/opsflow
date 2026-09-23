from app.database.connection import get_connection


def main():

    connection = get_connection()

    if connection.is_connected():
        print("MySQL connection successful.")

    connection.close()


if __name__ == "__main__":
    main()