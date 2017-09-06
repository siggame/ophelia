# -*- mode: ruby -*-
# vi: set ft=ruby :

# If running on Windows, we recommend running Git Bash as Administrator

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/zesty64"

  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 3001, host: 3001
  config.vm.network "forwarded_port", guest: 5432, host: 5432

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/home/ubuntu/workspace"
  
  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    sudo apt-get update
    sudo apt-get -y install git
    sudo apt-get -y install curl
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    curl -sSL https://get.docker.com/ | sh
    sudo usermod -aG docker $USER
    source $HOME/.nvm/nvm.sh
    nvm install node
    docker pull siggame/colisee-db:latest
  SHELL
end
