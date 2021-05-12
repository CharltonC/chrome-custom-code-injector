# log color
COLOR_WARN='\033[33m'  # Yellow
COLOR_DEF='\033[36m'   # Cyan
COLOR_END='\033[0m'

# cmd arguments:
# - component type $1
# - component name $2
CMP_TYPE=$1
CMP_NAME=$2

if [ -z "$CMP_TYPE" ]; then
    echo -e "$COLOR_WARN must provide component type $COLOR_END"

elif [ -z "$CMP_NAME" ]; then
    echo -e "$COLOR_WARN must provide component name, e.g. input-search $COLOR_END"

else
    echo -e "$COLOR_DEF copy component template files to /src/component/$CMP_TYPE/$CMP_NAME/ $COLOR_END"

    # Check if folder exist, Create it if not
    [ ! -d "./src/component/$CMP_TYPE" ] && mkdir ./src/component/$CMP_TYPE

    # CHECK if component exist, Create it if not
    [ ! -d "./src/component/$CMP_TYPE/$CMP_NAME" ] && cp -r ./schematic/component/ ./src/component/$CMP_TYPE/$CMP_NAME/

    echo -e "$COLOR_DEF done $COLOR_END"
fi
