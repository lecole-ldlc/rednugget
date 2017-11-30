n1 = {'x':0.1,'y':0.2,'z':0.3};
n2 = {'x':0.2,'y':0.2,'z':0.3};

function distance(n1, n2){
    var d = 0.0
    for(var prop in n1){
        d += (n1[prop]-n2[prop])*(n1[prop]-n2[prop])
    }
    return Math.sqrt(d);
}

console.log("distance",distance(n1,n2));