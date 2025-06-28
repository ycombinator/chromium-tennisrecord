usta-norcal-ad-in.zip:
	cd src/ && zip -r usta-norcal-ad-in.zip . && mv usta-norcal-ad-in.zip .. && cd -

clean:
	rm usta-norcal-ad-in.zip