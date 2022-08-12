#!/bin/sh

if [ ! ${EUID} -eq 0 ]; then
  echo "Please run as root or with sudo"
  exit
fi

# If user has sudo, confirm install
echo "ds-cli will be installed at /usr/bin/ds-cli. Proceed? (Y/n)"
read -r response
if [ "$response" == "" ] || [ "$response" == "y" ] || [ "$response" == "Y" ]; then
  echo "Installing ds-cli..."
  (
    cd /usr/bin
    sudo curl -o ds-cli https://raw.githubusercontent.com/ZadenMaestas/DeviceSync/main/bin/ds-cli.py
    chmod +x ds-cli # Make file executable
  )
  echo "Successfully installed ds-cli, You can now run it using ds-cli"
else
  echo "Understood. Quitting install script"
fi
