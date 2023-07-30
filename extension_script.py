import subprocess

def install_vscode_extension(extension_name):
    try:
        # code --install-extension 
        subprocess.run(['code', '--install-extension', extension_name], check=True)
        print(f"Extension '{extension_name}' installed successfully. ✨")
    except subprocess.CalledProcessError as e:
        print(f"Error installing extension '{extension_name}': {e}")
    except FileNotFoundError:
        print("Error: 'code' command not found. Make sure Visual Studio Code is installed and accessible from the command line.")

if __name__ == "__main__":
    extensions = [
        "ms-azuretools.vscode-docker",
        "hediet.vscode-drawio",
        "ecmel.vscode-html-css",
        "ms-vscode.vscode-typescript-next",
        "ritwickdey.liveserver",
        "pkief.material-icon-theme",
        "esbenp.prettier-vscode",
        "prisma.prisma",
        "prisma.prisma-insider",
        "redhat.vscode-yaml",
        "dotenv.dotenv-vscode"
    ]

    for extension_name in extensions:
        install_vscode_extension(extension_name)
    
    print("\t\t\t\treload the vscode window if necessary! 💻")
    
    print("Now, I will open the docker engine")
    try:
        subprocess.run(['open', '/Applications/Docker.app'])
        print('\t\t\t\tOpened successfully. ✨')
    except:
        print('Error in opening the docker engine. :(')