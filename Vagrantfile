# -*- mode: ruby -*-
# vi: set ft=ruby :

# If running on Windows, we recommend running Git Bash as Administrator

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/xenial64"

  config.vm.network "forwarded_port", guest: 3000, host: 3000

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/home/ubuntu/workspace"
  
  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    sudo apt-get update
    sudo apt-get install git
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    curl -sSL https://get.docker.com/ | sh
    sudo usermod -aG docker $USER
    source $HOME/.nvm/nvm.sh
    nvm install node
  SHELL
end
