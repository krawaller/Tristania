Object.clone = function(obj){
    if (typeof(obj) != "object"){
        return obj;
    }
    var clone = new obj.constructor(), props = [], p;
    for(p in obj){
        props.push([p]);
    }
    props.sort();
    for(p=0;p<props.length;p++){
        clone[props[p]] = typeof obj[props[p]] === "object" ? Object.clone(obj[props[p]]) : obj[props[p]];
    }
    return clone;
};


/*

SENT MEMBER OBJECT STRUCTURE:
{
    guid: guid,
    presentation: text,
    username: text,
    coords: {
                 // coords object with lat, long, etc
    }
    favalbum: albumid,
    favtracks: {
        albumid: trackid,
        albumid: trackid, ...
    }
}


DATABASE STRUCTURE:
 
 data = {
     members: {
         guid: {
             guid: guid,
             presentation: text,
             username: text,
             coords: {
                 // coords object with lat, long, etc
             }
             favalbum: albumid,
             favtracks: {
                 albumid: trackid,
                 albumid: trackid, ...
             }
         }
         guid: ...
     }
     stats: {
         members: int, // number of members in db
         favalbum: {
             votes: int, // number of votes
             results: {
                 albumid: {
                     votes: int,
                     percentage: int,
                 },
                 albumid: ...
             }
         }
         favtracks: {
             albumid: {
                 votes: int, // number of votes
                 results: {
                     trackid: {
                         votes: int,
                         percentage: int
                     }
                     trackid: ....
                 }
             }
         }
     }
 }
 
 
 WHEN A MEMBER OBJECT IS UPLOADED:
    IF ALREADY EXISTS IN DB
        REMOVE ALL VOTES ACCORDING TO OLD DATA, DECREASE VOTE COUNTS
    ELSE 
        INCREASE MEMBER COUNT IN STATS
    ADD VOTES, INCREASE COUNTS AND RECALCULATE PERCENTAGES   
    
 */
 
 
// places a vote in a vote object. returns the updated object, since it creates it if was first vote.
function placeVote(obj,votefor){
log("PLACEVOTE FUNCTION CALLED! VOTING FOR "+votefor);
    if (!obj){
log("...NEW OBJECT!");
        obj = {
            votes: 0,
            results: {}
        };
    }
    obj.votes++;
log("...NOW THERE ARE "+obj.votes+" IN THIS OBJ!");
    if (!obj.results[votefor]){
log("...FIRST VOTE FOR THIS!");
        obj.results[votefor] = {
            votes: 0
        };
    }
    obj.results[votefor].votes++;
log("...UPDATING COUNT FOR "+votefor+" TO "+obj.results[votefor].votes+"!");
    return obj;
}
 

// calculates percentages for the given vote object
function calculatePercentages(obj){
    for(var item in obj.results){
        obj.results[item].percentage = Math.round(100*obj.results[item].votes/obj.votes);
    }
}

var SECRETDBOBJ = 0;

function loadDataBase(){
    return SECRETDBOBJ || {
        members: {},
        stats: {
            members: 0,
            favtracks: {}
        }
    };
}

function saveDataBase(data){
    SECRETDBOBJ = data;
}

function log(msg){
    console.log(msg);
}
 
function removeVote(obj,votefor){
    if (!obj){
log("FIRST VOTE HERE, NO NEED TO REMOVE");
        return;
    }
log("REMOVING VOTE FOR "+votefor);
    obj.votes--;
    
    obj.results[votefor].votes--;
log("..."+votefor+" NOW HAS "+obj.results[votefor].votes+" VOTES OUT OF "+obj.votes);
}
 
function receiveData(member){
    var a, db = loadDataBase();
    if (db.members[member.guid]){ // existing member, removing his votes
        var oldmember = db.members[member.guid];
log("RECEIVING OLD MEMBER!");
        if (oldmember.favalbum){
            removeVote(db.stats.favalbum,oldmember.favalbum);
        }
        for(a in oldmember.favtracks){
            removeVote(db.stats.favtracks[a],oldmember.favtracks[a]);
        }
    }
    else { // new member, increasing member count
log("RECEIVING NEW MEMBER!");
        db.stats.members++;
    }
    // updating member data
    db.members[member.guid] = Object.clone(member);
    // adding votes for album and tracks
log("ADDING VOTES!");
    if (member.favalbum){
log("ADDING FAVALBUM VOTE");
        db.stats.favalbum = placeVote(db.stats.favalbum,member.favalbum);
    }
    for(a in member.favtracks){
log("ADDING FAVTRACK VOTE FOR "+a);
        db.stats.favtracks[a] = placeVote(db.stats.favtracks[a],member.favtracks[a]);
    }
    // recalculate all percentages
log("RECALCULATING!");
    calculatePercentages(db.stats.favalbum);
    for(a in db.stats.favtracks){
        calculatePercentages(db.stats.favtracks[a]);
    }
    // finally commit this data!
log("SAVING!");
    saveDataBase(db);
 }
 
 var u1 = {guid: 666, username: "david", presentation: "kokoko", favalbum: "widowsweeds", favtracks: {widowsweeds:"evenfall",ashes:"equilibrium"}},
     u2 = {guid: 667, username: "u2", presentation: "dsadas", favalbum: "beyondtheveil", favtracks: {widowsweeds:"evenfall",ashes:"libre"}};