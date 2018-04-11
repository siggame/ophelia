#!/usr/bin/env bash

MNT_DIR="/mnt/disks/psql"


are_you_sure=false

while [ "$are_you_sure" = false ] ;
do
    sudo lsblk
    echo "Please type the exact name of the disk you want to mount (sda,sbd, etc)"
    read DISK
    echo "You selected: $DISK"
    echo "Are you sure? (y/n)"
    read answer
    if [ "$answer" = y ] ; then
        are_you_sure=true
    fi
done


are_you_sure2=false

while [ "$are_you_sure2" = false ] ;
do
    echo "Would you like to reformat the disk?"
    echo "Only do this is it is a new disk with no information on it. (y/n)"
    read reformat
    echo "Are you sure? (y/n)"
    read answer2
    if [ "$answer2" = y ] ; then
        are_you_sure2=true
    fi
done

if [ "$reformat" = y ] ; then
    echo "Reformatting disk"
    sudo mkfs.ext4 -m 0 -F -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/${DISK}
fi

echo "Would you like to change the mounting directory (y/n)? Currently: $MNT_DIR"
read answer3
if [ answer3 = y ] ; then
    echo "What would you like the directory to be under /mnt/disks ?"
    read NEW_DIR
    MNT_DIR="$MNT_DIR$NEW_DIR"
fi

echo "Making mounting directory"
sudo mkdir -p ${MNT_DIR}

echo "Mounting disk"
sudo mount -o discard,defaults /dev/${DISK} ${MNT_DIR}

echo "Changing disk permissions"
sudo chmod a+w ${MNT_DIR}

echo "Would you like to automatically mount this disk on startup? (y/n)"
read answer4
if [ "$answer4" = y ] ; then
    echo "creating backup of /etc/fstab at /etc/fstab.backup"
    sudo cp /etc/fstab /etc/fstab.backup
    echo "modifying /etc/fstab"
    echo UUID=`sudo blkid -s UUID -o value /dev/sdb` ${MNT_DIR} ext4 discard,defaults,nofail 0 2 | sudo tee -a /etc/fstab
fi
