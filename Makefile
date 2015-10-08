DEPLOY=/srv/http/agora-core-view/

install:
	npm install
	bower install

build:
	grunt build

serve:
	grunt serve

deploy: build
	rsync -avz --delete dist/ ${DEPLOY}


all: build
	echo "OK"
