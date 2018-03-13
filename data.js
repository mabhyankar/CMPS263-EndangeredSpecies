(function() {

  window.VEHICLES=[]
  window.HABITAT={}
	var i;
  d3.csv("Species.csv",function(error, data){
    data.forEach(function(d) {
        d.name = d.name;
        d.habitat = d.habitat;
		d.endangered=d.when_it_became_endangered;
		d.value=d.endangered.split(",");
		
		d.hash={}
		for(i=0;i<d.value.length;i++)
		{
			d.hash[d.value[i].split("-")[1]]=d.value[i].split("-")[0];
			
		}
		
		HABITAT[d.name]=d.habitat
	});
	console.log(data[0].hash[' Endangered ']);
  });
  

}).call(this);

