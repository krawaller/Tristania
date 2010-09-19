var LDATA = (function(){
    var data = {
        members: {
            ole: {
                current: true,
                name: "Ole Vistnes",
                role: "Bass, backing vocals",
                member: "2008 &rarr; present"
            },
            kenneth: {
                name: "Kenneth Olsson",
                role: "Drums",
                member: "1997 &rarr; 2010"
            },
            tarald: {
                current: true,
                name: "Tarald Lie",
                role: "Drums",
                member: "2010 &rarr; present"
            },
            sveinterje: {
                name: "Svein-Terje Solvang",
                member: "2005 &rarr; 2008",
                role: "Guitars"
            },
            gyri: {
                name: "Gyri Losnegaard",
                member: "2009 &rarr; present",
                role: "Guitars",
                current: true
            },
            einar: {
                name: "Einar Moen",
                member: "1997 &rarr; present",
                role: "Keyboards",
                current: true
            },
            kjetili: {
                name: "Kjetil Ingebrethsen",
                member: "2002 &rarr; 2006",
                role: "Growls"
            },
            morten: {
                name: "Morten Veland",
                member: "1997 &rarr; 2000",
                role: "Guitars, growls"
            },
            osten: {
                name: "Østen Bergøy",
                member: "2001 &rarr; 2010",
                role: "Clean vocals"
            },
            rune: {
                name: "Rune Østerhus",
                member: "1997 &rarr; 2009",
                role: "Bass"
            },
            mary: {
                name: "Mariangela Demurtas",
                member: "2007 &rarr; present",
                current: true,
                role: "Vocals"
            },
            vibeke: {
                name: "Vibeke Stene",
                member: "1997 &rarr; 2007",
                role: "Vocals"
            },
            anders: {
                name: "Anders Høyvik Hidle",
                member: "1997 &rarr; present",
                role: "Guitars, vocals",
                current: true
            },
            kjetiln: {
                name: "Kjetil Nordhus",
                member: "2010 &rarr; present",
                current: true,
                role: "Clean vocals"
            }
        },
        discography: {
            rubicon: {
                title: "Rubicon",
                shorttitle: "Rbcn",
                pic: "tristania-rubicon.jpg",
                scanalbum: 194,
                year: 2010,
                lineup: ["mary","kjetiln","einar","ole","anders","tarald","gyri"],
                tracks: ["yearoftherat","protection","patriotgames","thepassing","exile","sirens","vulture","amnesia","magicalfix","illuminationtrack"],
                bonustracks: ["theemeraldpiper","caprice"],
                producer: "Waldemar Sorychta",
                contributors: ["Østen Bergøy, clean vocals","Pete Johansen, violins","Sigmund Olgart Vegge, growls"]
            },
            illumination: {
                title: "Illumination",
                shorttitle: "Ilmntn",
                pic: "tristania-illumination.jpg",
                scanalbum: 166,
                year: 2007,
                lineup: ["vibeke","einar","rune","anders","kenneth","osten","sveinterje"],
                tracks: ["mercyside","sanguinesky","openground","theravens","destinationdeparture","down","fate","lotus","sacrilege","deadlands"],
                bonustracks: ["inthewake","abinitio"],
                producer: "Waldemar Sorychta",
                contributors: ["Vorph, growls","Indigo string quartet, strings"]
            },
            ashes: {
                title: "Ashes",
                shorttitle: "Ashes",
                pic: "tristania-ashes.jpg",
                scanalbum: 165,
                year: 2005,
                lineup: ["vibeke","einar","rune","anders","kenneth","osten","kjetili"],
                tracks: ["libre","equilibrium","thewretched","cure","circus","shadowman","endogenesis","bird"],
                bonustracks: ["thegate"],
                producer: "Børge Finstad",
                contributors: ["Hans Joseph Groh, cello"]
            },
            worldofglass: {
                title: "World of Glass",
                shorttitle: "WoG",
                pic: "tristania-world.jpg",
                scanalbum: 164,
                year: 2001,
                lineup: ["vibeke","einar","rune","anders","kenneth"],
                tracks: ["theshiningpath","wormwood","tendertriponearth","lost","deadlocked","sellingout","hatredgrows","worldofglass","crusheddreams"],
                bonustracks: ["themodernend"],
                producer: "Terje Refsnes",
                contributors: ["Ronny Thorsen, growls","Østen Bergøy, clean vocals","Pete Johansen, violins","Jan Kenneth Barkved, clean vocals"]
            },
            beyondtheveil: {
                title: "Beyond the Veil",
                shorttitle: "BtV",
                pic: "tristania-btv.jpg",
                year: 1999,
                scanalbum: 163,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth"],
                tracks: ["beyondtheveil","aphelion","asequelofdecay","opusrelinque","letheanriver","ofruinsandarednightfall","simbelmyne","angina","heretique","dementia"],
                producer: "Terje Refsnes",
                contributors: ["Østen Bergøy, clean vocals","Pete Johansen, violins","Jan Kenneth Barkved, clean vocals"]
            },
            widowsweeds: {
                title: "Widow's weeds",
                shorttitle: "WW",
                pic: "tristania-ww.jpg",
                year: 1998,
                scanalbum: 162,
                lineup: ["vibeke","morten","einar","rune","anders","kenneth"],
                tracks: ["preludium","evenfall","paleenchantress","decemberelegy","midwintertears","angellore","mylostlenore","wastelandscaress","postludium"],
                producer: "Terje Refsnes",
                contributors: ["Østen Bergøy, clean vocals","Pete Johansen, violins"]
            },
            tristania: {
                title: "Tristania",
                shorttitle: "Tristania",
                pic: "tristania-demo.jpg",
                year: 1997,
                producer: "Gunnar Tønnesen",
                lineup: ["vibeke","morten","einar","rune","anders","kenneth"],
                tracks: ["sirene","midwintertears","paleenchantress","ceasetoexist"]
            }
        },
        tracks: {
            sirene: {
                title: "Sirene",
                length: "3:22",
                instrumental: true
            },
            ceasetoexist: {
                title: "Cease to Exist",
                length: "9:22",
                lyrics: ["morten"]
            },
            preludium: {
                title: "Preludium",
                length: "1:09",
                instrumental: true
            },
            evenfall: {
                title: "Evenfall",
                length: "6:54",
                lyrics: ["morten"]
            },
            paleenchantress: {
                title: "Pale Enchantress",
                length: "6:32",
                lyrics: ["morten"]
            },
            decemberelegy: {
                title: "December Elegy",
                length: "7:31",
                lyrics: ["morten"]
            },
            midwintertears: {
                title: "Midwintertears",
                length: "8:32",
                lyrics: ["morten"]
            },
            angellore: {
                title: "Angellore",
                length: "7:17",
                lyrics: ["morten"]
            },
            mylostlenore: {
                title: "My Lost Lenore",
                length: "6:23",
                lyrics: ["morten"]
            },
            wastelandscaress: {
                title: "Wasteland's Caress",
                length: "7:40",
                lyrics: ["morten"]
            },
            postludium: {
                title: "Postludium",
                length: "1:10",
                instrumental: true
            },
            beyondtheveil: {
                title: "Beyond the Veil",
                length: "6:37",
                music: ["morten","einar"],
                lyrics: ["morten","einar"]
            },
            aphelion: {
                title: "Aphelion",
                length: "7:50",
                music: ["morten"],
                lyrics: ["morten"]
            },
            asequelofdecay: {
                title: "A Sequel of Decay",
                length: "6:33",
                music: ["morten","einar"],
                lyrics: ["morten"]
            },
            opusrelinque: {
                title: "Opus Relinque",
                length: "6:08",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            letheanriver: {
                title: "Lethean River",
                length: "5:56",
                music: ["morten","einar"],
                lyrics: ["morten"]
            },
            ofruinsandarednightfall: {
                title: "Of Ruins and a Red Nightfall",
                length: "6:22",
                music: ["morten"],
                lyrics: ["morten"]
            },
            simbelmyne: {
                title: "Simbelmynë",
                length: "1:00",
                music: ["einar"],
                instrumental: true
            },
            angina: {
                title: "Angina",
                length: "4:39",
                music: ["morten"],
                lyrics: ["morten"]
            },
            heretique: {
                title: "Heretique",
                length: "4:51",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            dementia: {
                title: "Dementia",
                length: "2:21",
                music: ["einar"],
                lyrics: ["einar"]
            },
            theshiningpath: {
                title: "The Shining Path",
                length: "6:46",
                music: ["anders","einar"],
                lyrics: ["einar","osten"]
            },
            wormwood: {
                title: "Wormwood",
                length: "5:56",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            tendertriponearth: {
                title: "Tender Trip on Earth",
                length: "5:18",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            lost: {
                title: "Lost",
                length: "6:03",
                music: ["anders","einar"],
                lyrics: ["Pete Johansen"]
            },
            deadlocked: {
                title: "Deadlocked",
                length: "5:56",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            sellingout: {
                title: "Selling Out",
                length: "6:19",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            hatredgrows: {
                title: "Hatred Grows",
                length: "6:20",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            worldofglass: {
                title: "World of Glass",
                length: "5:26",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            crusheddreams: {
                title: "Crushed Dreams",
                length: "7:41",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            themodernend: {
                title: "The Modern End",
                length: "4:45",
                music: ["Seigmen"],
                lyrics: ["Seigmen"]
            },
            libre:{
                title: "Libre",
                length: "4:30",
                lyrics: ["Kjartan Hermansen"]
            },
            equilibrium:{
                title: "Equilibrium",
                length: "5:49"
            },
            thewretched:{
                title: "The Wretched",
                length: "7:00"
            },
            cure:{
                title: "Cure",
                length: "5:59"
            },
            circus:{
                title: "Circus",
                length: "5:09",
                lyrics: ["Kjartan Hermansen"]
            },
            shadowman:{
                title: "Shadowman",
                length: "6:31"
            },
            endogenesis:{
                title: "Endogenesis",
                length: "7:35"
            },
            bird:{
                title: "Bird",
                length: "5:09"
            },
            thegate:{
                title: "The Gate",
                length: "6:45"
            },
            mercyside:{
                title: "Mercyside",
                length: "4:39",
                music: ["anders","einar","Waldemar Sorychta"],
                lyrics: ["osten"]
            },
            sanguinesky:{
                title: "Sanguine Sky",
                length: "3:50",
                music: ["anders","einar"],
                lyrics: ["Kjartan Hermansen"]
            },
            openground:{
                title: "Open Ground",
                length: "4:40",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            theravens:{
                title: "The Ravens",
                length: "5:06",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            destinationdeparture:{
                title: "Destination Departure",
                length: "4:34",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            down:{
                title: "Down",
                length: "4:32",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            fate:{
                title: "Fate",
                length: "4:59",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            lotus:{
                title: "Lotus",
                length: "5:08",
                music: ["anders","einar"],
                lyrics: ["osten"]
            },
            sacrilege:{
                title: "Sacrilege",
                length: "4:15",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            deadlands:{
                title: "Deadlands",
                length: "6:39",
                music: ["anders","einar"],
                lyrics: ["einar"]
            },
            inthewake:{
                title: "In the Wake",
                length: "4:08"
            },
            abinitio:{
                title: "Ab Initio",
                length: "5:44"
            },
            yearoftherat:{
                title: "Year of the Rat",
                length: "4:35",
                lyrics: ["osten"],
                music: ["anders","ole","mary"]
            },
            protection:{
                title: "Protection",
                length: "4:15",
                lyrics: ["osten","mary"],
                music: ["anders","ole","mary"]
            },
            patriotgames:{
                title: "Patriot Games",
                length: "3:25",
                lyrics: ["osten"],
                music: ["anders","ole"]
            },
            thepassing:{
                title: "The Passing",
                length: "4:48",
                lyrics: ["tarald","Fredrik Sele","mary"],
                music: ["anders","ole","mary"]
            },
            exile:{
                title: "Exile",
                length: "4:26",
                lyrics: ["osten"],
                music: ["anders","ole","mary"]
            },
            sirens:{
                title: "Sirens",
                length: "4:27",
                lyrics: ["osten"],
                music: ["anders","ole","mary"]
            },
            vulture:{
                title: "Vulture",
                length: "3:43",
                lyrics: ["anders","tarald"],
                music: ["ole","Waldemar Sorychta","Sigmund Vegge","kjetiln"]
            },
            amnesia:{
                title: "Amnesia",
                length: "4:54",
                lyrics: ["ole","tarald"],
                music: ["ole","mary"],
            },
            magicalfix:{
                title: "Magical Fix",
                length: "4:20",
                lyrics: ["tarald"],
                music: ["ole","anders","tarald","Waldemar Sorychta"]
            },
            illuminationtrack:{
                title: "Illumination",
                length: "8:13",
                lyrics: ["osten"],
                music: ["einar"]
            },
            theemeraldpiper:{
                title: "The Emerald Piper",
                length: "3:07",
                lyrics: ["osten"],
                music: ["anders","ole"]
            },
            caprice:{
                title: "Caprice",
                length: "3:38",
                lyrics: ["tarald"],
                music: ["anders","ole"]
            }
        }
    };

    return {
        getMemberList: function(conds){
            var ret = [];
            m:for(var m in data.members){
                if (conds) {
                    for(var p in conds){
                        if (conds[p] != data.members[m][p]){
                            continue m;
                        }
                    }
                }
                ret.push({id:m,title:data.members[m].name,label:data.members[m].role});
            }
            return ret;
        },
        getMember: function(id,comments){
            var member = data.members[id];
            return !member ? 0 : $.merge({id:id, presentation: LDATA.getPresentation(id)}, comments ? {comments: LDATA.getComments(id)}:{} , data.members[id]);
        },
        getAlbums: function(){
            var ret = [];
            for(var a in data.discography){
                ret.push({
                    id: a,
                    pic: data.discography[a].pic,
                    shorttitle: data.discography[a].shorttitle,
                    title: data.discography[a].title,
                    tracks: data.discography[a].tracks,
                    bonustracks: data.discography[a].bonustracks,
                });
            }
            return ret;
        },
        getAlbum: function(id){
            var a = data.discography[id], lineup = [];
            if (!a){
                throw "No album "+id+"!";
            }
            a.lineup.map(function(who){
                lineup.push(LDATA.getMember(who));
            });
            return $.merge({id:id, presentation: LDATA.getPresentation(id), comments: LDATA.getComments(id), lineup: lineup},a);
        },
        getTracks: function(arr){
            var ret= [];
            arr.map(function(t){
                ret.push({
                    id: t,
                    title: data.tracks[t].title
                });
            });
            return ret;
        },
        getTrack: function(id){
            var albums = [], credits = {}, track = data.tracks[id], m;
            if (!track){
                throw "No track "+id+"!";
            }
            LDATA.getAlbums().map(function(a){
                a = LDATA.getAlbum(a.id); // need full data
                if (a.tracks.indexOf(id) != -1 || (a.bonustracks && a.bonustracks.indexOf(id) != -1)){
                    albums.push(a.title);
                }
            });
           ["music","lyrics"].map(function(c){
                if (track[c]){
                    credits[c] = [];
                    track[c].map(function(mid){
                        m = LDATA.getMember(mid);
                        credits[c].push( m ? { name: m.name, id: m.id } : mid );
                    });
                }
            });
            return $.merge({id:id, albums: albums, music: credits.music, lyrics: credits.lyrics, presentation: LDATA.getPresentation(id), comments: LDATA.getComments(id)},track);
        },
        getNews: function(){
            return JSON.parse(Ti.App.Properties.getString("news"));
        },
        getPresentation: function(id){
            return JSON.parse(Ti.App.Properties.getString("presentations"))[id];
        },
        getComments: function(id){
            var comments = JSON.parse(Ti.App.Properties.getString("comments"))[id];
            if (comments){ // TODO - should only do this when we update!
                for(var c in comments){
                    comments[c].name = LDATA.getMember(comments[c].by).name;
                }
            }
            return comments;
        },
        getSelectedVideos: function(){
            return JSON.parse(Ti.App.Properties.getString("selectedvideos"));
        },
        getOfficialVideos: function(){
            return JSON.parse(Ti.App.Properties.getString("officialvideos"));
        },
        getSelectedPhotoalbums: function(){
            return JSON.parse(Ti.App.Properties.getString("photoalbums"));
        },
        getAppData: function(){
            return JSON.parse(Ti.App.Properties.getString("appdata"));
        },
        getHistory: function(){
            return JSON.parse(Ti.App.Properties.getString("history") || JSON.stringify({info:"<div class='content'><p>Not yet loaded!</p></div>"}));
        },
        
// USER-ENTERED DATA
        
        getUserData: function(what){
            var d = JSON.parse(Ti.App.Properties.getString("userdata") || JSON.stringify({}));
            return what ? d[what] : d;
        },
        
        setUserData: function(what,value){
            var d = LDATA.getUserData();
            d[what] = value;
            Ti.App.Properties.setString("userdata",JSON.stringify(d));
        },
        
        removeUserData: function(what){
            var d = LDATA.getUserData();
            delete d[what];
            Ti.App.Properties.setString("userdata",JSON.stringify(d));
        },
        
        setFavouriteTrack: function(album,track){
            var tracks = LDATA.getUserData("favtracks") || {};
            tracks[album] = track;
            if (!track){
                delete tracks[album];
            }
            LDATA.setUserData("favtracks",tracks);
        },
        
        getFavouriteTrack: function(album){
            return (LDATA.getUserData("favtracks") || {})[album];
        },

        getCommunityMembers: function(){
            return JSON.parse(Ti.App.Properties.getString("communitymembers") || JSON.stringify(0));
        },
        
        getCommunityStatistics: function(){
            return JSON.parse(Ti.App.Properties.getString("communitystats") || JSON.stringify(0));
        }
    };
})();