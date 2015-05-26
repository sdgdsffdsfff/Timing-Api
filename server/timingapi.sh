#!/bin/bash
ROOT_PATH="/usr/Timing-Api/server"
SERVER_LOG="$ROOT_PATH/forever.log"
SERVER_JS="Server.js"
SERVER_FULLPATH="$ROOT_PATH/$SERVER_JS"
function start(){
    echo "start..."
    #start node
    if [ "`ps -C node v|grep $ROOT_PATH`" ]; then
        echo "TimingAPI service already run, skip it"
    else
        cd $ROOT_PATH
        forever start $SERVER_JS >> $SERVER_LOG 2>&1 &
        while [ ! "`ps -C node v|grep $ROOT_PATH`" ]
        do
            sleep 1
        done
        echo "TimingAPI service succeed start"
        cd -
    fi
}
function stop(){
    echo "stop..."
    #stop node
    if [ "`ps -C node v|grep $ROOT_PATH`" ]; then
        cd $ROOT_PATH
        forever stop $SERVER_JS >> $SERVER_LOG 2>&1 &
        while [ "`ps -C node v|grep $ROOT_PATH`" ]
        do
            sleep 1
        done
        echo "TimingAPI service stopped"
        cd -
    fi
}
cmd=$1
shift
case "$cmd" in
    start)
        start $1
        ;;
    stop)
        stop $1
        ;;
    restart)
        stop $1
        start $1
        ;;
    *)
        echo "only accept command \"start\", \"stop\" or \"restart\""
        ;;
esac
