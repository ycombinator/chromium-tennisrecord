tennisrecord.zip:
	cd src/ && zip -r tennisrecord.zip . && mv tennisrecord.zip .. && cd -

clean:
	rm tennisrecord.zip