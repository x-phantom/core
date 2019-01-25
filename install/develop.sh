#!/usr/bin/env bash

# -----------------------------------
# TYPOGRAPHY
# -----------------------------------

red=$(tput setaf 1)
green=$(tput setaf 2)
yellow=$(tput setaf 3)
lila=$(tput setaf 4)
pink=$(tput setaf 5)
blue=$(tput setaf 6)
white=$(tput setaf 7)
black=$(tput setaf 8)

bg_red=$(tput setab 1)
bg_green=$(tput setab 2)
bg_yellow=$(tput setab 3)
bg_lila=$(tput setab 4)
bg_pink=$(tput setab 5)
bg_blue=$(tput setab 6)
bg_white=$(tput setab 7)
bg_black=$(tput setab 8)

bold=$(tput bold)
reset=$(tput sgr0)

# Indicators
heading ()
{
    echo "    ${lila}==>${reset}${bold} $1${reset}"
}

success ()
{
    echo "    ${green}==>${reset}${bold} $1${reset}"
}

info ()
{
    echo "    ${blue}==>${reset}${bold} $1${reset}"
}

warning ()
{
    echo "    ${yellow}==>${reset}${bold} $1${reset}"
}

error ()
{
    echo "    ${red}==>${reset}${bold} $1${reset}"
}

# Colored Text
text_red ()
{
    echo "${red}$1${reset}"
}

text_green ()
{
    echo "${green}$1${reset}"
}

text_yellow ()
{
    echo "${yellow}$1${reset}"
}

text_lila ()
{
    echo "${lila}$1${reset}"
}

text_pink ()
{
    echo "${pink}$1${reset}"
}

text_blue ()
{
    echo "${blue}$1${reset}"
}

text_white ()
{
    echo "${white}$1${reset}"
}

text_black ()
{
    echo "${black}$1${reset}"
}

# Styles
text_bold ()
{
    echo "${bold}"
}

text_reset ()
{
    echo "${reset}"
}

# Helpers
divider ()
{
        text_lila "    ==============================================================="
}

paragraph ()
{
  text_white "$1" | fold -w67 | paste -sd'\n' -
}

# Detect pkg type
DEB=$(which apt-get)
RPM=$(which yum)

yarn_install ()
{
    heading "Installing node.js dependencies..."

    yarn global add pm2
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 500M
    pm2 set pm2-logrotate:compress true
    pm2 set pm2-logrotate:retain 7

    success "Installed node.js dependencies!"
}

rpm_install ()
{
    # -----------------------------------
    # RPMSET SYSTEM LOCALE
    # -----------------------------------

    if [[ $(locale -a | grep ^en_US.UTF-8) ]] || [[ $(locale -a | grep ^en_US.utf8) ]]; then
        if ! $(grep -E "(en_US.UTF-8)" "$HOME/.bashrc"); then
            # Setting the bashrc locale
            echo "export LC_ALL=en_US.UTF-8" >> "$HOME/.bashrc"
            echo "export LANG=en_US.UTF-8" >> "$HOME/.bashrc"
            echo "export LANGUAGE=en_US.UTF-8" >> "$HOME/.bashrc"

            # Setting the current shell locale
            export LC_ALL="en_US.UTF-8"
            export LANG="en_US.UTF-8"
            export LANGUAGE="en_US.UTF-8"
        fi
    else
        # Install en_US.UTF-8 Locale
        sudo localedef -c -i en_US -f UTF-8 en_US.UTF-8
        # Setting the current shell locale
        export LC_ALL="en_US.UTF-8"
        export LANG="en_US.UTF-8"
        export LANGUAGE="en_US.UTF-8"

        # Setting the bashrc locale
        echo "export LC_ALL=en_US.UTF-8" >> "$HOME/.bashrc"
        echo "export LANG=en_US.UTF-8" >> "$HOME/.bashrc"
        echo "export LANGUAGE=en_US.UTF-8" >> "$HOME/.bashrc"
    fi

    # -----------------------------------
    # SYSTEM DEPENDENCIES
    # -----------------------------------

    heading "Installing system dependencies..."

    sudo yum update -y
    sudo yum install git curl epel-release -y

    success "Installed system dependencies!"

    # -----------------------------------
    # INSTALL NODE.JS/NPM
    # -----------------------------------

    heading "Installing node.js & npm..."

    sudo rm -rf /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/{npm*,node*,man1/node*}
    sudo rm -rf ~/{.npm,.forever,.node*,.cache,.nvm}

    sudo yum install gcc-c++ make -y
    curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash - > /dev/null 2>&1

    success "Installed node.js & npm!"

    # -----------------------------------
    # INSTALL YARN
    # -----------------------------------

    heading "Installing Yarn..."

    curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
    sudo yum install yarn -y

    success "Installed Yarn!"

    # -----------------------------------
    # PROGRAM DEPENDENCIES
    # -----------------------------------

    heading "Installing program dependencies..."

    sudo yum groupinstall "Development Tools" -y -q
    sudo yum install postgresql-devel jq -y -q

    success "Installed program dependencies!"

    # -----------------------------------
    # INSTALL POSTGRESQL
    # -----------------------------------

    heading "Installing PostgreSQL..."

    sudo yum install postgresql postgresql-contrib -y

    success "Installed PostgreSQL!"

    # -----------------------------------
    # INSTALL NTPD
    # -----------------------------------

    heading "Installing NTP..."

    sudo timedatectl set-ntp off # disable the default systemd timesyncd service
    sudo yum install ntp -y -q
    sudo ntpd -gq

    success "Installed NTP!"

    # -----------------------------------
    # NODE.JS DEPENDENCIES
    # -----------------------------------

    yarn_install

    # -----------------------------------
    # SYSTEM UPDATES
    # -----------------------------------

    heading "Installing system updates..."

    sudo yum update
    sudo yum clean

    success "Installed system updates!"

    # -----------------------------------
    # TODO: SETUP POSTGRES USER/PASS/DB
    # -----------------------------------

    # -----------------------------------
    # TODO: INSTALL @ARKECOSYSTEM/CORE
    # -----------------------------------
}

deb_install ()
{
    # -----------------------------------
    # SET SYSTEM LOCALE
    # -----------------------------------

    if [[ $(locale -a | grep ^en_US.UTF-8) ]] || [[ $(locale -a | grep ^en_US.utf8) ]]; then
        if ! $(grep -E "(en_US.UTF-8)" "$HOME/.bashrc"); then
            # Setting the bashrc locale
            echo "export LC_ALL=en_US.UTF-8" >> "$HOME/.bashrc"
            echo "export LANG=en_US.UTF-8" >> "$HOME/.bashrc"
            echo "export LANGUAGE=en_US.UTF-8" >> "$HOME/.bashrc"

            # Setting the current shell locale
            export LC_ALL="en_US.UTF-8"
            export LANG="en_US.UTF-8"
            export LANGUAGE="en_US.UTF-8"
        fi
    else
        # Install en_US.UTF-8 Locale
        sudo locale-gen en_US.UTF-8
        sudo update-locale LANG=en_US.UTF-8

        # Setting the current shell locale
        export LC_ALL="en_US.UTF-8"
        export LANG="en_US.UTF-8"
        export LANGUAGE="en_US.UTF-8"

        # Setting the bashrc locale
        echo "export LC_ALL=en_US.UTF-8" >> "$HOME/.bashrc"
        echo "export LANG=en_US.UTF-8" >> "$HOME/.bashrc"
        echo "export LANGUAGE=en_US.UTF-8" >> "$HOME/.bashrc"
    fi

    # -----------------------------------
    # SYSTEM DEPENDENCIES
    # -----------------------------------

    heading "Installing system dependencies..."

    sudo apt-get update
    sudo apt-get install -y git curl apt-transport-https update-notifier

    success "Installed system dependencies!"

    # -----------------------------------
    # INSTALL NODE.JS/NPM
    # -----------------------------------

    heading "Installing node.js & npm..."

    sudo rm -rf /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/{npm*,node*,man1/node*}
    sudo rm -rf ~/{.npm,.forever,.node*,.cache,.nvm}

    sudo wget --quiet -O - https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
    (echo "deb https://deb.nodesource.com/node_10.x $(lsb_release -s -c) main" | sudo tee /etc/apt/sources.list.d/nodesource.list)
    sudo apt-get update
    sudo apt-get install nodejs -y

    success "Installed node.js & npm!"

    # -----------------------------------
    # INSTALL YARN
    # -----------------------------------

    heading "Installing Yarn..."

    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    (echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list)

    sudo apt-get update
    sudo apt-get install -y yarn

    success "Installed Yarn!"

    # -----------------------------------
    # PROGRAM DEPENDENCIES
    # -----------------------------------

    heading "Installing program dependencies..."

    sudo apt-get install build-essential libcairo2-dev pkg-config libtool autoconf automake python libpq-dev jq -y

    success "Installed program dependencies!"

    # -----------------------------------
    # INSTALL POSTGRESQL
    # -----------------------------------

    heading "Installing PostgreSQL..."

    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib -y

    success "Installed PostgreSQL!"

    # -----------------------------------
    # INSTALL NTPD
    # -----------------------------------

    heading "Installing NTP..."

    sudo timedatectl set-ntp off # disable the default systemd timesyncd service
    sudo apt-get install ntp -yyq
    sudo ntpd -gq

    success "Installed NTP!"

    # -----------------------------------
    # NODE.JS DEPENDENCIES
    # -----------------------------------

    yarn_install

    # -----------------------------------
    # SYSTEM UPDATES
    # -----------------------------------

    heading "Installing system updates..."

    sudo apt-get update
    sudo apt-get upgrade -yqq
    sudo apt-get dist-upgrade -yq
    sudo apt-get autoremove -yyq
    sudo apt-get autoclean -yq

    success "Installed system updates!"

    # -----------------------------------
    # TODO: SETUP POSTGRES USER/PASS/DB
    # -----------------------------------

    # -----------------------------------
    # TODO: INSTALL @ARKECOSYSTEM/CORE
    # -----------------------------------
}

if [[ ! -z $DEB ]]; then
    heading "No RPM package structure detected"
    success "Running install for Debian derivate"
   deb_install
elif [[ ! -z $RPM ]]; then
    heading "No DEB package structure detected"
    success "Running install for RedHat derivate"
   rpm_install
else
    heading "Not supported system"
   exit 1;
fi