#!/usr/bin/python
import getpass
import os
import pickle
import platform
import requests
import sys

USERNAME = os.getlogin()  # Fetch username of logged-in user
DEVICESYNC_URL = "https://devicesync.theprotondev.repl.co"
DEVICESYNC_VERSION = "V0.0.2"

def read_text_file(filename):
    try:
        with open(filename, "r") as file:
            return file.read()
    except IOError:
        print("Error, file does not exist")
        sys.exit()


def save_session(session):
    if not os.path.exists(f"/home/{USERNAME}/.config/devicesync"):
        os.mkdir(f"/home/{USERNAME}/.config/devicesync")
    with open(f'/home/{USERNAME}/.config/devicesync/session.pkl', 'wb') as f:
        pickle.dump(session, f)


def load_session():
    with open(f'/home/{USERNAME}/.config/devicesync/session.pkl', 'rb') as f:
        session = pickle.load(f)
        return session


def is_logged_in(silence=False):
    if os.path.exists(f"/home/{USERNAME}/.config/devicesync/session.pkl"):
        return True
    elif not os.path.exists(f"/home/{USERNAME}/.config/devicesync/session") and not silence:
        print("You're not logged in, please do so using `ds-cli auth login`")


def prompt_for_login():
    print("Login to DeviceSync Below:\n")
    username = input("Username: ")
    password = getpass.getpass("Password: ")

    if username and password:
        session = requests.session()  # Save session to variable
        request_response = session.post(f"{DEVICESYNC_URL}/account/signin",
                                        {"username": username, "password": password})
        response = request_response.json()
        try:
            print(response["Success"])
            save_session(session)
        except KeyError:
            print(response["Error"])

    else:
        print(
            "You have to enter both a username and password, exiting program, please try again")


def get_notes():
    session = load_session()
    request = session.get(f"{DEVICESYNC_URL}/account/getNotes")
    response = request.json()
    try:
        if not response["Notes"]:
            print("You have no existing notes, you can create one using `ds-cli notes add <title> "
                  "<file to grab contents of>`")
        else:
            iteration = 1
            for note in response["Notes"]:
                print(f"{iteration}. {note['Title']}")
                iteration += 1
            # Once done with the loop ask for input
            selected = int(input("Enter the number of the note you want to read or press enter to leave the menu\n> "))
            if selected != "":
                iteration = 1
                for note in response["Notes"]:
                    if iteration == selected:
                        print(note["Content"])
                        break
                    iteration += 1
    except KeyError:
        print(response["Error"])


def get_note(args):
    required_params_included = len(args) == 4
    if required_params_included:
        title = args[3]
        session = load_session()
        request = session.get(f"{DEVICESYNC_URL}/account/getNotes")
        response = request.json()
        try:
            if not response["Notes"]:
                print("You have no existing notes, you can create one using `ds-cli notes add <title> "
                      "<file to grab contents of>`")
            else:
                note_found = False
                for note in response["Notes"]:
                    if note["Title"] == title:
                        print(note["Content"])
                        note_found = True
                        break
                if not note_found:
                    print("No note could be found under that title, you can check your existing notes using `ds-cli "
                          "notes get`")
        except KeyError:
            print(response["Error"])
    else:
        print("Please include the title parameter of the note to fetch")


def new_note(args):
    required_params_included = len(args) == 5
    if required_params_included:
        title = args[3]
        content = read_text_file(args[4])
        session = load_session()
        request = session.post(f"{DEVICESYNC_URL}/account/newNote",
                               {"title": title, "content": content})
        response = request.json()
        try:
            print(response["Success"])
        except KeyError:
            print(response["Error"])
    else:
        print("Please include both a title and file to read contents from")


def edit_note(args):
    required_params_included = len(args) == 5
    if required_params_included:
        title = args[3]
        content = read_text_file(args[4])
        session = load_session()
        request = session.post(f"{DEVICESYNC_URL}/account/editNote",
                               {"title": title, "content": content})
        response = request.json()
        try:
            print(response["Success"])
        except KeyError:
            print(response["Error"])
    else:
        print("Please include both a title and file to read contents from")


def delete_note(args):
    required_params_included = len(args) == 4
    if required_params_included:
        title = args[3]
        session = load_session()
        request = session.post(f"{DEVICESYNC_URL}/account/deleteNote",
                               {"title": title})
        response = request.json()
        try:
            print(response["Success"])
        except KeyError:
            print(response["Error"])
    else:
        print("Please include a title of a note to delete")


def main():
    if platform.system() == "Linux":
        help_msg = """DeviceSync CLI By Zaden Maestas

-- Available Commands --
    usage: ds-cli <command_category> <subcommand_if_any>
    
    notes
        notes get | Gets a list of your existing note titles
        notes new <title> <file to fetch contents of>
        notes get <title> | Gets the specified note if existing
        notes delete <title>
    auth
        auth login
        auth signup
        auth logout
    
    update
    version
    """
        args = sys.argv
        if len(args) == 1:
            print(help_msg)
            sys.exit(1)
        else:
            if args[1] == "auth":
                if len(args) != 2:
                    if args[2] == "login":
                        if not is_logged_in(silence=True):
                            prompt_for_login()
                        elif is_logged_in():
                            print("Error, you're already logged in")
                    elif args[2] == "logout":
                        if is_logged_in():
                            os.system(f"rm -rf /home/{USERNAME}/.config/devicesync")
                            print("Successfully logged out")
                    elif args[2] == "signup":
                        print("Please sign up through the DeviceSync site: "
                              f"{DEVICESYNC_URL}/account/signup")
            elif args[1] == "notes":
                if is_logged_in():
                    try:
                        if args[2] == "get":
                            if len(args) == 3:  # If command was only "ds-cli notes get"
                                get_notes()
                            else:  # If command specified title of note to get contents from
                                get_note(args)
                        elif args[2] == "new":
                            new_note(args)
                        elif args[2] == "delete":
                            delete_note(args)
                        elif args[2] == "edit":
                            edit_note(args)
                    except IndexError:
                        print(help_msg)
            elif args[1] == "version":
                print(f"You are running DeviceSync CLI {DEVICESYNC_VERSION}")
            elif args[1] == "update":
                os.system("""CURRENT_VERSION=$(ds-cli version)
curl -o latest_cli https://raw.githubusercontent.com/ZadenMaestas/DeviceSync/main/bin/ds-cli.py
LATEST_VERSION=$(python latest_cli version)
if [ "$LATEST_VERSION" == "$CURRENT_VERSION" ]
then
  echo "You are on the latest version of DeviceSync CLI"
  rm latest_cli
else
  echo "You are using an outdated version of DeviceSync CLI"
  echo "Updating to the latest version of DeviceSync CLI"
  echo "Attemping to run 'sudo mv latest_cli /usr/bin/ds-cli' please grant sudo access below."
  sudo mv latest_cli /usr/bin/ds-cli
  sudo chmod +x /usr/bin/ds-cli
fi""")
            else:
                print(help_msg)
    elif platform.system() != "Linux":
        print(f"Hm, it seems your operating system is not supported, it's likely you're running {platform.system()}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nKeyboard Interrupt Detected.\n\nExiting Program.")
