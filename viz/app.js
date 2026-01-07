(function(){

  const _tooltipSel = d3.select('#tooltip');
  const tooltip = _tooltipSel.empty()
    ? d3.select('body').append('div').attr('id', 'tooltip')
    : _tooltipSel;

  tooltip
    .style('position', 'fixed')
    .style('pointer-events', 'none')
    .style('background', 'rgba(0,0,0,0.85)')
    .style('color', '#fff')
    .style('padding', '6px 8px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('z-index', '9999')
    .style('opacity', 0)
    .style('transition', 'opacity 120ms ease');

  // helper: return ticks excluding the domain min/max
  function filteredTicks(scale, count){
    return scale.ticks(count).filter(t => t !== scale.domain()[0] && t !== scale.domain()[1]);
  }

  // helper: title-case a name (e.g. "THE STRANGER" -> "The Stranger")
  function titleCase(str){
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // Inline CSV strings parsed at runtime to avoid async loading
  const meanCSV = `Character,compound,lines
DUDE,-0.00753952,625
WALTER,-0.049398319327731095,476
MAUDE,0.07578598130841122,107
LEBOWSKI,-0.003606249999999997,96
BRANDT,0.1316671875,64
THE STRANGER,0.089396,50
VOICE,0.07222045454545455,44
DONNY,-0.04147441860465116,43
TREEHORN,0.04728888888888889,27
DIETER,-0.19091923076923076,26
MAN,-0.11668695652173913,23
QUINTANA,-0.23234117647058822,17
DA FINO,-0.06574375,16
DONNELLY,0.12075,14
SMOKEY,-0.08568571428571428,14
CHIEF,-0.06426153846153847,13
POLICEMAN,0.07439166666666666,12
BLOND MAN,0.05599090909090909,11
BUNNY,-0.10325,10
WOO,-0.07200999999999999,10
YOUNGER COP,0.08671111111111111,9
DRIVER,-0.2714375,8
PILAR,0.1189125,8
KIEFFER,-0.14268571428571428,7
SECOND MAN,0.10212000000000002,5
ANOTHER VOICE,0.09244999999999999,4
FIRST MAN,-0.15284999999999999,4
GARY,0.1581,4
ALLAN,0.159225,4
TONY,0.2421333333333333,3
FRANZ,0.0,3
VOICE THROUGH MACHINE,0.0,3
WAITRESS,0.13066666666666668,3
OLDER COP,0.09106666666666667,3
WOMAN,0.0,3
SECOND CHAUFFEUR,0.15445,2
HALLWAY,0.0,2
PHONE VOICE,0.0191,2
GEORGE BUSH,-0.3595,1
MESSAGE,0.0,1
VIVA VOCE,0.4404,1
BARTENDER,0.0,1
THIRD MAN,0.0,1
`;

  const lineCSV = `Character,Line,compound,neg,neu,pos
THE STRANGER,"A way out west there was a fella, fella I want to tell you about, fella by the name of Jeff Lebowski. ",0.0772,0.0,0.942,0.058
THE STRANGER,"At least, that was the handle his lovin' parents gave him, but he never had much use for it himself. ",0.0,0.0,1.0,0.0
THE STRANGER,"This Lebowski, he called himself the Dude. ",0.0,0.0,1.0,0.0
THE STRANGER,"Now, Dude, that's a name no one would self-apply where I come from. ",-0.296,0.155,0.845,0.0
THE STRANGER,"But then, there was a lot about the Dude that didn't make a whole lot of sense to me. ",0.0,0.0,1.0,0.0
THE STRANGER,"And a lot about where he lived, like- wise. ",0.6808,0.0,0.556,0.444
THE STRANGER,"But then again, maybe that's why I found the place s'durned innarestin'.",0.0,0.0,1.0,0.0
THE STRANGER,They call Los Angeles the City of Angels. ,0.0,0.0,1.0,0.0
THE STRANGER,"I didn't find it to be that exactly, but I'll allow as there are some nice folks there. ",0.7227,0.0,0.726,0.274
THE STRANGER,"'Course, I can't say I seen London, and I never been to France, and I ain't never seen no queen in her damn undies as the fella says. ",-0.5199,0.144,0.856,0.0
THE STRANGER,"But I'll tell you what, after seeing Los Angeles and thisahere story I'm about to unfold--wal, I guess I seen somethin' ever' bit as stupefyin' as ya'd see in any a those other places, and in English too, so I can die with a smile on my face without feelin' like the good Lord gypped me.",-0.3205,0.125,0.77,0.105
THE STRANGER,Now this story I'm about to unfold took place back in the early nineties--just about the time of our conflict with Sad'm and the Eye-rackies. ,-0.3182,0.087,0.913,0.0
THE STRANGER,"I only mention it 'cause some- times there's a man--I won't say a hee-ro, 'cause what's a hee-ro?--but sometimes there's a man.",0.0,0.0,1.0,0.0
THE STRANGER,"And I'm talkin' about the Dude here-- sometimes there's a man who, wal, he's the man for his time'n place, he fits right in there--and that's the Dude, in Los Angeles.",0.0,0.0,1.0,0.0
THE STRANGER,"...and even if he's a lazy man, and the Dude was certainly that--quite possibly the laziest in Los Angeles County.",-0.5859,0.242,0.664,0.094
THE STRANGER,...which would place him high in the runnin' for laziest worldwide--but sometimes there's a man. . . sometimes there's a man.,-0.5719,0.156,0.844,0.0
THE STRANGER,"Wal, I lost m'train of thought here. ",-0.3182,0.277,0.723,0.0
THE STRANGER,"But--aw hell, I done innerduced him enough.",-0.6808,0.434,0.566,0.0
DUDE,It's the LeBaron.,0.0,0.0,1.0,0.0
DUDE,"It's uh, it's down there somewhere. ",0.0,0.0,1.0,0.0
DUDE,Lemme take another look.,0.0,0.0,1.0,0.0
DUDE,"Oh, man. ",0.0,0.0,1.0,0.0
DUDE,Don't do--,0.0,0.0,1.0,0.0
DUDE,"Look, nobody calls me Lebowski. ",0.0,0.0,1.0,0.0
DUDE,You got the wrong guy. ,-0.4767,0.437,0.563,0.0
DUDE,"I'm the Dude, man.",0.0,0.0,1.0,0.0
DUDE,Bunny?,0.0,0.0,1.0,0.0
DUDE,"Look, moron.",-0.4939,0.762,0.238,0.0
DUDE,You see a wedding ring?,0.0,0.0,1.0,0.0
DUDE,Does this place look like I'm fucking married?,0.3612,0.0,0.737,0.263
DUDE, All my plants are dead!,-0.68,0.534,0.466,0.0
DUDE,Obviously you're not a golfer.,0.0,0.0,1.0,0.0
DUDE,Hey. ,0.0,0.0,1.0,0.0
DUDE,At least I'm housebroken.,0.0,0.0,1.0,0.0
WALTER,This was a valued rug.,0.4404,0.0,0.58,0.42
WALTER,"This was, uh--",0.0,0.0,1.0,0.0
DUDE,"Yeah man, it really tied the room together--",0.296,0.0,0.761,0.239
WALTER,"This was a valued, uh.",0.4404,0.0,0.58,0.42
DONNY,"What tied the room together, Dude?",0.0,0.0,1.0,0.0
WALTER,"Were you listening to the story, Donny?",0.0,0.0,1.0,0.0
DONNY,What--,0.0,0.0,1.0,0.0
WALTER,Were you listening to the Dude's story?,0.0,0.0,1.0,0.0
DONNY,I was bowling--,0.0,0.0,1.0,0.0
WALTER,"So you have no frame of reference, Donny. ",-0.3535,0.26,0.74,0.0
WALTER,You're like a child who wanders in in the middle of a movie and wants to know--,0.3612,0.0,0.865,0.135
DUDE,"What's your point, Walter?",0.0,0.0,1.0,0.0
WALTER,"There's no fucking reason--here's my point, Dude--there's no fucking reason--",-0.5267,0.355,0.645,0.0
DONNY,"Yeah Walter, what's your point?",0.296,0.0,0.645,0.355
WALTER,Huh?,0.0,0.0,1.0,0.0
DUDE,"What's the point of--we all know who was at fault, so what the fuck are you talking about?",-0.7553,0.288,0.712,0.0
WALTER,Huh?,0.0,0.0,1.0,0.0
WALTER,No!,0.0,0.0,1.0,0.0
WALTER, What the fuck are you talking--I'm not--we're talking about unchecked aggression here--,-0.6908,0.363,0.637,0.0
DONNY,What the fuck is he talking about?,-0.5423,0.368,0.632,0.0
DUDE,My rug.,0.0,0.0,1.0,0.0
WALTER,"Forget it, Donny. ",-0.2263,0.487,0.513,0.0
WALTER,You're out of your element.,0.0,0.0,1.0,0.0
DUDE,"This Chinaman who peed on my rug, I can't go give him a bill so what the fuck are you talking about?",-0.5809,0.152,0.848,0.0
WALTER,What the fuck are you talking about?!,-0.5848,0.387,0.613,0.0
WALTER, This Chinaman is not the issue!,0.0,0.0,1.0,0.0
WALTER," I'm talking about drawing a line in the sand, Dude. ",0.0,0.0,1.0,0.0
WALTER,"Across this line you do not, uh--and also, Dude, Chinaman is not the preferred, uh. . . Asian- American. ",0.0,0.0,1.0,0.0
WALTER,Please.,0.3182,0.0,0.0,1.0
DUDE,"Walter, this is not a guy who built the rail- roads, here, this is a guy who peed on my--",0.0,0.0,1.0,0.0
WALTER,What the fuck are you--,-0.5423,0.467,0.533,0.0
DUDE,"Walter, he peed on my rug--",0.0,0.0,1.0,0.0
DONNY,He peed on the Dude's rug--,0.0,0.0,1.0,0.0
WALTER,YOU'RE OUT OF YOUR ELEMENT!,0.0,0.0,1.0,0.0
WALTER," This Chinaman is not the issue, Dude.",0.0,0.0,1.0,0.0
DUDE,So who--,0.0,0.0,1.0,0.0
WALTER,Jeff Lebowski. ,0.0,0.0,1.0,0.0
WALTER,Come on. ,0.0,0.0,1.0,0.0
WALTER,This other Jeffrey Lebowski. ,0.0,0.0,1.0,0.0
WALTER,The millionaire. ,0.0,0.0,1.0,0.0
WALTER,"He's gonna be easier to find anyway than these two, uh. these two  . . . And he has the wealth, uh, the resources obviously, and there is no reason, no FUCKING reason, why his wife should go out and owe money and they pee on your rug. ",0.6896,0.041,0.813,0.146
WALTER,Am I wrong?,-0.4767,0.608,0.392,0.0
DUDE,"No, but--",0.0,0.0,1.0,0.0
WALTER,Am I wrong!,-0.5255,0.629,0.371,0.0
DUDE,"Yeah, but--",0.1531,0.0,0.385,0.615
WALTER,"Okay. That, uh.",0.2263,0.0,0.513,0.487
DUDE,Fuckin' A.,0.0,0.0,1.0,0.0
DONNY,And this guy peed on it.,0.0,0.0,1.0,0.0
WALTER,Donny!,0.0,0.0,1.0,0.0
WALTER, Please!,0.3802,0.0,0.0,1.0
DUDE,"Yeah, I could find this Lebowski guy--",0.296,0.0,0.732,0.268
DONNY,His name is Lebowski?,0.0,0.0,1.0,0.0
DONNY,"That's your name, Dude!",0.0,0.0,1.0,0.0
DUDE,"Yeah, this is the guy, this guy should compensate me for the fucking rug. ",0.296,0.0,0.855,0.145
DUDE,I mean his wife goes out and owes money and they pee on my rug.,0.0,0.0,1.0,0.0
WALTER,Thaaat's right Dude; they pee on your fucking Rug.,0.0,0.0,1.0,0.0
DUDE,"Yes, uh, very impressive.",0.7425,0.0,0.241,0.759
DUDE,"I'm not really, uh.",0.0,0.0,1.0,0.0
DUDE,Uh-huh.,0.0,0.0,1.0,0.0
DUDE,Uh-huh.,0.0,0.0,1.0,0.0
DUDE,"Hey, is this him with Nancy?",0.0,0.0,1.0,0.0
DUDE,Lebowski on the right?,0.0,0.0,1.0,0.0
DUDE,"He's handicapped, huh?",0.0,0.0,1.0,0.0
DUDE,Far out.,0.0,0.0,1.0,0.0
DUDE,Nancy's pretty good.,0.7269,0.0,0.141,0.859
DUDE,Are these.,0.0,0.0,1.0,0.0
DUDE,"Different mothers, huh?",0.0,0.0,1.0,0.0
DUDE,"I guess he's pretty, uh, racially pretty cool--",0.8271,0.0,0.365,0.635
DUDE,I see.,0.0,0.0,1.0,0.0
DUDE,Jeez. ,0.0,0.0,1.0,0.0
DUDE,Think he's got room for one more?,0.0,0.0,1.0,0.0
DUDE,"Well, yeah I did, but I spent most of my time occupying various, um, administration buildings--",0.2846,0.0,0.816,0.184
DUDE,"--smoking thai-stick, breaking into the ROTC--",0.0,0.0,1.0,0.0
DUDE,--and bowling. ,0.0,0.0,1.0,0.0
DUDE,"I'll tell you the truth, Brandt, I don't remember most of it.--Jeez!",0.3802,0.0,0.809,0.191
DUDE, Fuck me!,-0.5848,0.791,0.209,0.0
LEBOWSKI,"Okay sir, you're a Lebowski, I'm a Lebowski, that's terrific, I'm very busy so what can I do for you?",0.6124,0.0,0.783,0.217
DUDE,"Well sir, it's this rug I have, really tied the room together-",0.2732,0.0,0.84,0.16
LEBOWSKI,"You told Brandt on the phone, he told me. ",0.0,0.0,1.0,0.0
LEBOWSKI,So where do I fit in?,0.3612,0.0,0.667,0.333
DUDE,"Well they were looking for you, these two guys, they were trying to--",0.2732,0.0,0.851,0.149
LEBOWSKI,"I'll say it again, all right?",0.0,0.0,1.0,0.0
LEBOWSKI,You told Brandt. ,0.0,0.0,1.0,0.0
LEBOWSKI,He told me. ,0.0,0.0,1.0,0.0
LEBOWSKI,I know what happened. Yes?,0.4019,0.0,0.597,0.403
LEBOWSKI,Yes?,0.4019,0.0,0.0,1.0
DUDE,So you know they were trying to piss on your rug--,-0.4019,0.213,0.787,0.0
LEBOWSKI,Did I urinate on your rug?,0.0,0.0,1.0,0.0
DUDE,"You mean, did you personally come and pee on my--",0.0,0.0,1.0,0.0
LEBOWSKI,Hello!,0.0,0.0,1.0,0.0
LEBOWSKI, Do you speak English?,0.0,0.0,1.0,0.0
LEBOWSKI,Parla usted Inglese?,0.0,0.0,1.0,0.0
LEBOWSKI,I'll say it again. ,0.0,0.0,1.0,0.0
LEBOWSKI,Did I urinate on your rug?,0.0,0.0,1.0,0.0
DUDE,"Well no, like I said, Woo peed on the rug--",0.7717,0.0,0.476,0.524
LEBOWSKI,Hello!,0.0,0.0,1.0,0.0
LEBOWSKI, Hello!,0.0,0.0,1.0,0.0
LEBOWSKI," So every time--I just want to understand this, sir--every time a rug is micturated upon in this fair city, I have to compensate the--",0.4451,0.0,0.849,0.151
DUDE,"Come on, man, I'm not trying to scam anybody here, I'm just--",0.4585,0.0,0.786,0.214
LEBOWSKI,"You're just looking for a handout like every other--are you employed, Mr. Lebowski?",0.3612,0.0,0.828,0.172
DUDE,"Look, let me explain something. ",0.0,0.0,1.0,0.0
DUDE, I'm not Mr. Lebowski;  you're Mr. Lebowski. ,0.0,0.0,1.0,0.0
DUDE,I'm the Dude. ,0.0,0.0,1.0,0.0
DUDE,So that's  what  you  call me. ,0.0,0.0,1.0,0.0
DUDE,"That, or Duder. His  Dudeness. ",0.0,0.0,1.0,0.0
DUDE,"Or El Duderino, if,  you know, you're not into the whole brevity thing--",0.0,0.0,1.0,0.0
LEBOWSKI,"Are you employed, sir?",0.0,0.0,1.0,0.0
DUDE,Employed?,0.0,0.0,1.0,0.0
LEBOWSKI,You don't go out and make a living dressed like that in the middle of a weekday.,0.3612,0.0,0.865,0.135
DUDE,Is this a--what day is this?,0.0,0.0,1.0,0.0
LEBOWSKI,"But I do work, so if you don't mind--",0.0,0.0,1.0,0.0
DUDE,"No, look. ",0.0,0.0,1.0,0.0
DUDE,I do mind. ,0.0,0.0,1.0,0.0
DUDE,The Dude minds. ,0.0,0.0,1.0,0.0
DUDE,"This will not stand, ya know, this will not stand, man. ",0.0,0.0,1.0,0.0
DUDE,"I mean, if your wife owes--",0.0,0.0,1.0,0.0
LEBOWSKI,"My wife is not the issue here. I hope that my wife will someday learn to live on her allowance, which is ample, but if she doesn't, sir, that will be her problem, not mine, just as your rug is your problem, just as every bum's lot in life is his own responsibility regardless of whom he chooses to blame. ",-0.85,0.15,0.822,0.029
LEBOWSKI,"I didn't blame anyone for the loss of my legs, some chinaman in Korea took them from me but I went out and achieved anyway. ",-0.0341,0.063,0.879,0.058
LEBOWSKI,"I can't solve your problems, sir, only you can.",0.1695,0.147,0.645,0.208
DUDE,Ah fuck it.,-0.5423,0.636,0.364,0.0
LEBOWSKI,Sure!,0.3802,0.0,0.0,1.0
LEBOWSKI, Fuck it!,-0.5848,0.791,0.209,0.0
LEBOWSKI, That's your answer!,0.0,0.0,1.0,0.0
LEBOWSKI, Tattoo it on your forehead!,0.0,0.0,1.0,0.0
LEBOWSKI, Your answer to everything!,0.0,0.0,1.0,0.0
LEBOWSKI,"Your ""revolution"" is over, Mr. ",0.0,0.0,1.0,0.0
LEBOWSKI,Lebowski!,0.0,0.0,1.0,0.0
LEBOWSKI, Condolences!,0.0,0.0,1.0,0.0
LEBOWSKI, The bums lost!,-0.3802,0.564,0.436,0.0
LEBOWSKI,"...My advice is, do what your parents did!",0.0,0.0,1.0,0.0
LEBOWSKI," Get a job, sir!",0.0,0.0,1.0,0.0
LEBOWSKI," The bums will always lose-- do you hear me, Lebowski?",-0.4019,0.231,0.769,0.0
LEBOWSKI,THE BUMS WILL ALWAYS--,0.0,0.0,1.0,0.0
DUDE,Okay. ,0.2263,0.0,0.0,1.0
DUDE,The old man told me to take any rug in the house.,0.0,0.0,1.0,0.0
DUDE,It's the LeBaron.,0.0,0.0,1.0,0.0
DUDE,"Yeah sure, if I'm ever in the neighborhood, need to use the john.",0.5423,0.0,0.71,0.29
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,You want me to blow on your toes?,0.0772,0.0,0.843,0.157
DUDE,You sure he won't mind?,0.3182,0.0,0.635,0.365
DUDE,Practicing?,0.0,0.0,1.0,0.0
DUDE,You're Bunny?,0.0,0.0,1.0,0.0
DUDE,I'm just gonna find a cash machine.,0.0,0.0,1.0,0.0
DONNY,Grasshopper Dude--They're dead in the water!!,-0.7081,0.494,0.506,0.0
DUDE,"Your maples, Carl.",0.0,0.0,1.0,0.0
WALTER,"Way to go, Dude. ",0.0,0.0,1.0,0.0
WALTER,"If you will it, it is no dream.",-0.1877,0.199,0.801,0.0
DUDE,You're fucking twenty minutes late. ,0.0,0.0,1.0,0.0
DUDE,What the fuck is that?,-0.5423,0.467,0.533,0.0
WALTER,Theodore Herzel.,0.0,0.0,1.0,0.0
DUDE,Huh?,0.0,0.0,1.0,0.0
WALTER,State of Israel. ,0.0,0.0,1.0,0.0
WALTER,"If you will it, Dude, it is no--",0.0,0.0,1.0,0.0
DUDE,What the fuck're you talking about?,0.0,0.0,1.0,0.0
DUDE,The carrier. ,0.0,0.0,1.0,0.0
DUDE,What's in the fucking carrier?,0.0,0.0,1.0,0.0
WALTER,Huh?,0.0,0.0,1.0,0.0
WALTER,Oh--Cynthia's Pomeranian. ,0.0,0.0,1.0,0.0
WALTER,Can't leave him home alone or he eats the furniture.,-0.2148,0.179,0.718,0.103
DUDE,What the fuck are you--,-0.5423,0.467,0.533,0.0
WALTER,"I'm saying, Cynthia's Pomeranian. ",0.0,0.0,1.0,0.0
WALTER,I'm looking after it while Cynthia and Marty Ackerman are in Hawaii.,0.0,0.0,1.0,0.0
DUDE,You brought a fucking Pomeranian bowling?,0.0,0.0,1.0,0.0
WALTER,"What do you mean ""brought it bowling""?",0.0,0.0,1.0,0.0
WALTER,I didn't rent it shoes. ,0.0,0.0,1.0,0.0
WALTER,I'm not buying it a fucking beer. ,0.0,0.0,1.0,0.0
WALTER,"He's not gonna take your fucking turn, Dude.",0.0,0.0,1.0,0.0
DUDE,"Hey, man, if my fucking ex-wife asked me to take care of her fucking dog while she and her boyfriend went to Honolulu, I'd tell her to go fuck herself. ",-0.0772,0.101,0.807,0.092
DUDE,Why can't she board it?,0.0,0.0,1.0,0.0
WALTER,"First of all, Dude, you don't have an ex, secondly, it's a fucking show dog with fucking papers. ",0.0,0.0,1.0,0.0
WALTER,You can't board it. ,0.0,0.0,1.0,0.0
WALTER,"It gets upset, its hair falls out.",-0.3818,0.302,0.698,0.0
DUDE,Hey man--,0.0,0.0,1.0,0.0
WALTER,"Fucking dog has papers, Dude.--Over the line!",0.0,0.0,1.0,0.0
WALTER,Smokey Huh?,0.0,0.0,1.0,0.0
WALTER,"Over the line, Smokey!",0.0,0.0,1.0,0.0
WALTER, I'm sorry. ,-0.0772,0.565,0.435,0.0
WALTER,That's a foul.,0.0,0.0,1.0,0.0
WALTER,Excuse me!,0.1511,0.0,0.386,0.614
WALTER, Mark it zero. ,0.0,0.0,1.0,0.0
WALTER,Next frame.,0.0,0.0,1.0,0.0
WALTER,This is not Nam. ,0.0,0.0,1.0,0.0
WALTER,This is bowling. ,0.0,0.0,1.0,0.0
WALTER,There are rules.,0.0,0.0,1.0,0.0
DUDE,"Come on Walter, it's just--it's Smokey. ",0.0,0.0,1.0,0.0
DUDE,"So his toe slipped over a little, it's just a game.",0.0,0.0,1.0,0.0
WALTER,This is a league game. ,0.0,0.0,1.0,0.0
WALTER,"This determines who enters the next round-robin, am I wrong?",-0.4767,0.256,0.744,0.0
WALTER,Am I wrong!?,-0.5255,0.629,0.371,0.0
WALTER,"Smokey my friend, you're entering a world of pain.",-0.0258,0.244,0.519,0.237
DUDE,Hey Walter--,0.0,0.0,1.0,0.0
WALTER,"Mark that frame an eight, you're entering a world of pain.",-0.5106,0.248,0.752,0.0
WALTER,A world of pain.,-0.5106,0.524,0.476,0.0
WALTER,HAS THE WHOLE WORLD GONE CRAZY?,-0.34,0.324,0.676,0.0
WALTER,AM I THE ONLY ONE HERE WHO GIVES A SHIT ABOUT THE RULES?,-0.5574,0.231,0.769,0.0
WALTER,MARK IT ZERO!,0.0,0.0,1.0,0.0
DUDE,"Walter, they're calling the cops, put the piece away.",0.0,0.0,1.0,0.0
WALTER,MARK IT ZERO!,0.0,0.0,1.0,0.0
WALTER,YOU THINK I'M FUCKING AROUND HERE?,0.0,0.0,1.0,0.0
WALTER,MARK IT ZERO!!,0.0,0.0,1.0,0.0
WALTER,"This is a league game, Smokey!",0.0,0.0,1.0,0.0
DUDE,"Walter, you can't do that. ",0.0,0.0,1.0,0.0
DUDE,"These guys're like me, they're pacificists. ",0.3612,0.0,0.667,0.333
DUDE,Smokey was a conscientious objector.,0.0,0.0,1.0,0.0
WALTER,"You know Dude, I myself dabbled with pacifism at one point. ",0.0,0.0,1.0,0.0
WALTER,"Not in Nam, of course--",0.0,0.0,1.0,0.0
DUDE,And you know Smokey has emotional problems!,-0.3382,0.312,0.521,0.167
WALTER,You mean--beyond pacifism?,0.0,0.0,1.0,0.0
DUDE,"He's fragile, man!",0.0,0.0,1.0,0.0
DUDE, He's very fragile!,0.0,0.0,1.0,0.0
WALTER,Huh. ,0.0,0.0,1.0,0.0
WALTER,I did not know that. ,0.0,0.0,1.0,0.0
WALTER,"Well, it's water under the bridge. ",0.2732,0.0,0.704,0.296
WALTER,"And we do enter the next round-robin, am I wrong?",-0.4767,0.256,0.744,0.0
DUDE,"No, you're not wrong--",0.3724,0.0,0.54,0.46
WALTER,Am I wrong!,-0.5255,0.629,0.371,0.0
DUDE,"You're not wrong, Walter, you're just an asshole.",0.3724,0.0,0.733,0.267
WALTER,Okay then. ,0.2263,0.0,0.345,0.655
WALTER,We play Quintana and O'Brien next week. ,0.34,0.0,0.714,0.286
WALTER,They'll be pushovers.,0.0,0.0,1.0,0.0
DUDE,"Just, just take it easy, Walter.",0.4404,0.0,0.633,0.367
WALTER,"That's your answer to everything, Dude. ",0.0,0.0,1.0,0.0
WALTER,And let me point out--pacifism is not--look at our current situation with that camelfucker in Iraq--pacifism is not something to hide behind.,0.1326,0.0,0.933,0.067
DUDE,"Well, just take 't easy, man.",0.6124,0.0,0.444,0.556
WALTER,"I'm perfectly calm, Dude.",0.7579,0.0,0.235,0.765
DUDE,Yeah?,0.296,0.0,0.0,1.0
DUDE,Wavin' a gun around?!,-0.4003,0.473,0.527,0.0
WALTER,Calmer than you are.,0.3612,0.0,0.545,0.455
DUDE,"Just take it easy, man!",0.4926,0.0,0.556,0.444
WALTER,Calmer than you are.,0.3612,0.0,0.545,0.455
DUDE,Shit!,-0.5983,1.0,0.0,0.0
DUDE,Hiya Allan.,0.0,0.0,1.0,0.0
DUDE,"Sure Allan, I'll be there.",0.3182,0.0,0.635,0.365
DUDE,"Yeah, yeah I know. Okay.",0.6486,0.0,0.241,0.759
DUDE,"Yeah, okay.",0.4767,0.0,0.0,1.0
DUDE,Huh.,0.0,0.0,1.0,0.0
LEBOWSKI,It's funny. ,0.4404,0.0,0.256,0.744
LEBOWSKI,"I can look back on a life of achievement, on challenges met, competitors bested, obstacles overcome. ",-0.3182,0.145,0.782,0.073
LEBOWSKI,"I've accomplished more than most men, and without the use of my legs. ",0.4404,0.0,0.805,0.195
LEBOWSKI,"What. . . What makes a man, Mr. Lebowski?",0.0,0.0,1.0,0.0
DUDE,Dude.,0.0,0.0,1.0,0.0
LEBOWSKI,Huh?,0.0,0.0,1.0,0.0
DUDE,"I don't know, sir.",0.0,0.0,1.0,0.0
LEBOWSKI,"Is it. . . is it, being prepared to do the right thing?",0.2263,0.0,0.863,0.137
LEBOWSKI,Whatever the price?,0.0,0.0,1.0,0.0
LEBOWSKI,Isn't that what makes a man?,0.0,0.0,1.0,0.0
DUDE,Sure. ,0.3182,0.0,0.0,1.0
DUDE,That and a pair of testicles.,0.0,0.0,1.0,0.0
LEBOWSKI,You're joking. ,0.2263,0.0,0.345,0.655
LEBOWSKI,But perhaps you're right.,0.0,0.0,1.0,0.0
DUDE,Mind if I smoke a jay?,0.0,0.0,1.0,0.0
LEBOWSKI,Bunny.,0.0,0.0,1.0,0.0
DUDE,'Scuse me?,0.0,0.0,1.0,0.0
LEBOWSKI,Bunny Lebowski. . . She is the light of my life. ,0.0,0.0,1.0,0.0
LEBOWSKI,"Are you surprised at my tears, sir?",0.0,0.216,0.568,0.216
DUDE,Fuckin' A.,0.0,0.0,1.0,0.0
LEBOWSKI,Strong men also cry. . . Strong men also cry.,0.1027,0.33,0.319,0.351
LEBOWSKI,I received this fax this morning.,0.0,0.0,1.0,0.0
LEBOWSKI,"As you can see, it is a ransom note. ",0.0,0.0,1.0,0.0
LEBOWSKI,Sent by cowards. ,0.0,0.0,1.0,0.0
LEBOWSKI,Men who are unable to achieve on a level field of play. ,0.34,0.0,0.821,0.179
LEBOWSKI,Men who will not sign their names. ,0.0,0.0,1.0,0.0
LEBOWSKI,Weaklings. ,-0.34,1.0,0.0,0.0
LEBOWSKI,Bums.,0.0,0.0,1.0,0.0
DUDE,Bummer.,-0.3818,1.0,0.0,0.0
LEBOWSKI,Brandt will fill you in on the details.,0.0,0.0,1.0,0.0
DUDE,"Why me, man?",0.0,0.0,1.0,0.0
DUDE,"So he thinks it's the carpet-pissers, huh?",0.0,0.0,1.0,0.0
DUDE,"Fucking Quintana--that creep can roll, man--",0.0,0.0,1.0,0.0
WALTER,"Yeah, but he's a fucking pervert, Dude.",-0.6474,0.426,0.435,0.139
DUDE,Huh?,0.0,0.0,1.0,0.0
WALTER,The man is a sex offender. ,-0.3612,0.333,0.667,0.0
WALTER,With a record. ,0.0,0.0,1.0,0.0
WALTER,Spent six months in Chino for exposing himself to an eight-year-old.,-0.2732,0.174,0.826,0.0
DUDE,Huh.,0.0,0.0,1.0,0.0
WALTER,When he moved down to Venice he had to go door-to-door to tell everyone he's a pederast.,0.0,0.0,1.0,0.0
DONNY,"What's a pederast, Walter?",0.0,0.0,1.0,0.0
WALTER,"Shut the fuck up, Donny.",-0.5423,0.467,0.533,0.0
WALTER,Anyway. ,0.0,0.0,1.0,0.0
WALTER,How much they offer you?,0.0,0.0,1.0,0.0
DUDE,Twenty grand. ,0.4588,0.0,0.25,0.75
DUDE,And of course I still keep the rug.,0.0,0.0,1.0,0.0
WALTER,Just for making the hand-off?,0.0,0.0,1.0,0.0
DUDE,Yeah.,0.296,0.0,0.0,1.0
DUDE,"...They  gave  Dude  a  beeper,  so  whenever these guys call--",0.0,0.0,1.0,0.0
WALTER,What if it's during a game?,0.0,0.0,1.0,0.0
DUDE,I told him if it was during league play--,0.34,0.0,0.769,0.231
DONNY,If what's during league play?,0.34,0.0,0.625,0.375
WALTER,"Life does not stop and start at your convenience, you miserable piece of shit.",-0.7106,0.345,0.559,0.096
DONNY,"What's wrong with Walter, Dude?",-0.4767,0.437,0.563,0.0
DUDE,"I figure it's easy money, it's all pretty harmless. ",0.7964,0.0,0.426,0.574
DUDE,I mean she probably kidnapped herself.,0.0,0.0,1.0,0.0
WALTER,Huh?,0.0,0.0,1.0,0.0
DONNY,"What do you mean, Dude?",0.0,0.0,1.0,0.0
DUDE,Rug-peers did not do this. ,0.0,0.0,1.0,0.0
DUDE,I mean look at it. ,0.0,0.0,1.0,0.0
DUDE,Young trophy wife. ,0.0,0.0,1.0,0.0
DUDE,Marries a guy for money but figures he isn't giving her enough. ,-0.3724,0.188,0.812,0.0
DUDE,She owes money all over town--,0.0,0.0,1.0,0.0
WALTER,That...fucking...bitch!,0.0,0.0,1.0,0.0
DUDE,It's all a goddamn fake. ,-0.7351,0.674,0.326,0.0
DUDE,"Like Lenin said, look for the person who will benefit. ",0.6705,0.0,0.593,0.407
DUDE,"And you will, uh, you know, you'll, uh, you know what I'm trying to say--",0.0,0.0,1.0,0.0
DONNY,I am the Walrus.,0.0,0.0,1.0,0.0
WALTER,That fucking bitch!,-0.6581,0.687,0.313,0.0
DUDE,Yeah.,0.296,0.0,0.0,1.0
DONNY,I am the Walrus.,0.0,0.0,1.0,0.0
WALTER,"Shut the fuck up, Donny!",-0.5848,0.487,0.513,0.0
WALTER, V.I. Lenin!,0.0,0.0,1.0,0.0
WALTER, Vladimir Ilyich Ulyanov!,0.0,0.0,1.0,0.0
DONNY,What the fuck is he talking about?,-0.5423,0.368,0.632,0.0
WALTER,"That's fucking exactly what happened, Dude!",0.0,0.0,1.0,0.0
WALTER, That makes me fucking SICK!,-0.6826,0.536,0.464,0.0
DUDE,"Yeah, well, what do you care, Walter?",0.7579,0.0,0.348,0.652
DONNY,"Yeah Dude, why is Walter so pissed off?",-0.6329,0.396,0.442,0.162
WALTER,Those rich fucks!,0.2003,0.388,0.125,0.487
WALTER, This whole fucking thing-- I did not watch my buddies die face down in the muck so that this fucking strumpet--,-0.5994,0.163,0.837,0.0
DUDE,"I don't see any connection to Vietnam, Walter.",0.0,0.0,1.0,0.0
WALTER,"Well, there isn't a literal connection, Dude.",0.2732,0.0,0.741,0.259
DUDE,"Walter, face it, there isn't any connection. ",0.0,0.0,1.0,0.0
DUDE,It's your roll.,0.0,0.0,1.0,0.0
WALTER,Have it your way. ,0.0,0.0,1.0,0.0
WALTER,The point is--,0.0,0.0,1.0,0.0
DUDE,It's your roll--,0.0,0.0,1.0,0.0
WALTER,The fucking point is--,0.0,0.0,1.0,0.0
DUDE,It's your roll.,0.0,0.0,1.0,0.0
QUINTANA,I see you rolled your way into the semis. ,0.0,0.0,1.0,0.0
QUINTANA,"Deos mio, man. ",0.0,0.0,1.0,0.0
QUINTANA,"Seamus and me, we're gonna fuck you up.",-0.5423,0.333,0.667,0.0
DUDE,"Yeah well, that's just, ya know, like, your opinion, man.",0.7003,0.0,0.507,0.493
QUINTANA,"Let me tell you something, bendeco. ",0.0,0.0,1.0,0.0
QUINTANA,"You pull any your crazy shit with us, you flash a piece out on the lanes, I'll take it away from you and stick it up your ass and pull the fucking trigger til it goes ""click"".",-0.8591,0.218,0.782,0.0
DUDE,Jesus.,0.0,0.0,1.0,0.0
QUINTANA,"You said it, man. ",0.0,0.0,1.0,0.0
QUINTANA,Nobody fucks with the Jesus.,-0.4767,0.437,0.563,0.0
WALTER,"Eight-year-olds, Dude.",0.0,0.0,1.0,0.0
DUDE,Oh man.,0.0,0.0,1.0,0.0
DUDE,"Oh, nothin', you know.",0.0,0.0,1.0,0.0
DUDE,Uh-huh.,0.0,0.0,1.0,0.0
DUDE,"Oh, man, don't say that..",0.0,0.0,1.0,0.0
DUDE,Shit.,-0.5574,1.0,0.0,0.0
WALTER,Take the ringer. ,0.0,0.0,1.0,0.0
WALTER,I'll drive.,0.0,0.0,1.0,0.0
DUDE,The what?,0.0,0.0,1.0,0.0
WALTER,The ringer!,0.0,0.0,1.0,0.0
WALTER," The ringer, Dude!",0.0,0.0,1.0,0.0
WALTER, Have they called yet?,0.0,0.0,1.0,0.0
DUDE,What the hell is this?,-0.6808,0.535,0.465,0.0
WALTER,My dirty undies. ,-0.4404,0.592,0.408,0.0
WALTER,"Laundry, Dude. ",0.0,0.0,1.0,0.0
WALTER,The whites.,0.0,0.0,1.0,0.0
DUDE,Agh--,0.0,0.0,1.0,0.0
DUDE,"Walter, I'm sure there's a reason you brought your dirty undies--",-0.1531,0.204,0.634,0.162
WALTER,"Thaaaat's right, Dude. ",0.0,0.0,1.0,0.0
WALTER,The weight. ,0.0,0.0,1.0,0.0
WALTER,The ringer can't look empty.,0.1511,0.0,0.715,0.285
DUDE,Walter--what the fuck are you thinking?,-0.5423,0.412,0.588,0.0
WALTER,"Well you're right, Dude, I got to thinking. ",0.2732,0.0,0.769,0.231
WALTER,I got to thinking why should we settle for a measly fucking twenty grand--,0.507,0.0,0.799,0.201
DUDE,We?,0.0,0.0,1.0,0.0
DUDE,What the fuck we?,-0.5423,0.538,0.462,0.0
DUDE,You said you just wanted to come along--,0.0,0.0,1.0,0.0
WALTER,"My point, Dude, is why should we settle for twenty grand when we can keep the entire million. ",0.4588,0.0,0.85,0.15
WALTER,Am I wrong?,-0.4767,0.608,0.392,0.0
DUDE,Yes you're wrong. ,-0.1027,0.456,0.147,0.397
DUDE,"This isn't a fucking game, Walter--",0.0,0.0,1.0,0.0
WALTER,It is a fucking game. ,0.0,0.0,1.0,0.0
WALTER,"You said so yourself, Dude--she kidnapped herself--",0.0,0.0,1.0,0.0
DUDE,"Yeah, but--",0.1531,0.0,0.385,0.615
DUDE,Dude here.,0.0,0.0,1.0,0.0
DUDE,Dude the Bagman. ,0.0,0.0,1.0,0.0
DUDE,Where do you want us to go?,0.0772,0.0,0.822,0.178
DUDE,Yeah?,0.296,0.0,0.0,1.0
WALTER,"Dude, are you fucking this up?",0.0,0.0,1.0,0.0
DUDE,"The driver man, I told you--",0.0,0.0,1.0,0.0
DUDE,Oh shit. ,-0.5574,0.783,0.217,0.0
DUDE,Walter.,0.0,0.0,1.0,0.0
WALTER,What the fuck is going on there?,-0.5423,0.368,0.632,0.0
DUDE,"They hung up, Walter!",0.0,0.0,1.0,0.0
DUDE, You fucked it up!,-0.69,0.61,0.39,0.0
DUDE, You fucked it up!,-0.69,0.61,0.39,0.0
DUDE, Her life was in our hands!,0.0,0.0,1.0,0.0
WALTER,"Easy, Dude.",0.4404,0.0,0.256,0.744
DUDE,We're screwed now!,-0.5411,0.636,0.364,0.0
DUDE, We don't get shit and they're gonna kill her!,-0.471,0.335,0.469,0.196
DUDE," We're fucked, Walter!",-0.69,0.701,0.299,0.0
WALTER,"Dude, nothing is fucked. ",0.5448,0.0,0.46,0.54
WALTER,Come on. ,0.0,0.0,1.0,0.0
WALTER,You're being very unDude. ,0.0,0.0,1.0,0.0
WALTER,They'll call back. ,0.0,0.0,1.0,0.0
WALTER,"Look, she kidnapped her--",0.0,0.0,1.0,0.0
WALTER,Ya see?,0.0,0.0,1.0,0.0
WALTER,"Nothing is fucked up here, Dude. ",0.5448,0.0,0.587,0.413
WALTER,Nothing is fucked. ,0.5448,0.0,0.363,0.637
WALTER,These  guys are fucking amateurs--,0.0,0.0,1.0,0.0
DUDE,"Shutup, Walter!",0.0,0.0,1.0,0.0
DUDE, Don't fucking say peep when I'm doing business here.,0.0,0.0,1.0,0.0
WALTER,Okay Dude. ,0.2263,0.0,0.345,0.655
WALTER,Have it your way.,0.0,0.0,1.0,0.0
WALTER,But they're amateurs.,0.0,0.0,1.0,0.0
DUDE,Dude here.,0.0,0.0,1.0,0.0
DUDE,Yeah.,0.296,0.0,0.0,1.0
DUDE,"Hey, just tell me where the fuck you want us to go.",-0.4939,0.236,0.676,0.088
DUDE,That was the sign.,0.0,0.0,1.0,0.0
WALTER,Yeah. ,0.296,0.0,0.0,1.0
WALTER,"So as long as we get her back, nobody's in a position to complain. ",-0.3612,0.161,0.839,0.0
WALTER,And we keep the baksheesh.,0.0,0.0,1.0,0.0
DUDE,"Terrific, Walter. ",0.4767,0.0,0.244,0.756
DUDE,But you haven't told me how we get her back. ,0.0,0.0,1.0,0.0
DUDE,Where is she?,0.0,0.0,1.0,0.0
WALTER,"That's the simple part, Dude. ",0.0,0.0,1.0,0.0
WALTER,"When  we make the handoff, I grab the guy and beat  it out of him.",0.0,0.0,1.0,0.0
WALTER,...Huh?,0.0,0.0,1.0,0.0
DUDE,Yeah. ,0.296,0.0,0.0,1.0
DUDE,"That's a great plan, Walter. ",0.6249,0.0,0.494,0.506
DUDE,"That's fucking ingenious, if I understand it correctly. ",0.0,0.0,1.0,0.0
DUDE,That's a Swiss fucking watch.,0.0,0.0,1.0,0.0
WALTER,"Thaaat's right, Dude. ",0.0,0.0,1.0,0.0
WALTER,The beauty of this is its simplicity. If the plan gets too complex something always goes wrong. ,0.1779,0.142,0.685,0.174
WALTER,If there's one thing I learned in Nam--,0.0,0.0,1.0,0.0
DUDE,Dude.,0.0,0.0,1.0,0.0
DUDE,FUCK.,-0.5423,1.0,0.0,0.0
WALTER,What'd he say?,0.0,0.0,1.0,0.0
WALTER,Where's the hand-off?,0.0,0.0,1.0,0.0
DUDE,"There is no fucking hand-off, Walter!",-0.3595,0.333,0.667,0.0
DUDE,  At a wooden bridge we throw the money out  of the car!,0.0,0.0,1.0,0.0
WALTER,Huh?,0.0,0.0,1.0,0.0
DUDE,We throw the money out of the moving car!,0.0,0.0,1.0,0.0
WALTER,"We can't do that, Dude. ",0.0,0.0,1.0,0.0
WALTER,That fucks up our plan.,-0.4767,0.437,0.563,0.0
DUDE,"Well call them up and explain it to 'em, Walter!",0.3382,0.0,0.79,0.21
DUDE," Your plan is so fucking simple, I'm sure they'd fucking understand it!",0.4321,0.0,0.794,0.206
DUDE, That's the beauty of it Walter!,0.6239,0.0,0.55,0.45
WALTER,"Wooden bridge, huh?",0.0,0.0,1.0,0.0
DUDE,"I'm throwing the money, Walter!",0.0,0.0,1.0,0.0
DUDE, We're not fucking around!,0.0,0.0,1.0,0.0
WALTER,The bridge is coming up!,0.0,0.0,1.0,0.0
WALTER," Gimme the ringer, Dude!",0.0,0.0,1.0,0.0
WALTER, Chop-chop!,0.0,0.0,1.0,0.0
DUDE,Fuck that!,-0.5848,0.791,0.209,0.0
DUDE," I love you, Walter, but sooner or later you're gonna have to face the fact that you're a goddamn moron.",-0.7814,0.301,0.606,0.093
WALTER,"Okay, Dude. ",0.2263,0.0,0.345,0.655
WALTER,No time to argue. ,-0.5574,0.697,0.303,0.0
WALTER,Here's the bridge--,0.0,0.0,1.0,0.0
DUDE,Walter!,0.0,0.0,1.0,0.0
WALTER,"Your wheel, Dude!",0.0,0.0,1.0,0.0
WALTER, I'm rolling out!,0.0,0.0,1.0,0.0
DUDE,What the fuck?,-0.5423,0.636,0.364,0.0
WALTER,Your wheel!,0.0,0.0,1.0,0.0
WALTER, At fifteen em-pee-aitch I roll out!,0.0,0.0,1.0,0.0
WALTER," I double back, grab one of 'em and beat it out of him!",0.0,0.0,1.0,0.0
WALTER, The uzi!,0.0,0.0,1.0,0.0
DUDE,Uzi?,0.0,0.0,1.0,0.0
WALTER,You didn't think I was rolling out of here naked!,0.0,0.0,1.0,0.0
DUDE,"Walter, please--",0.3182,0.0,0.303,0.697
WALTER,Fifteen!,0.0,0.0,1.0,0.0
WALTER," This is it, Dude!",0.0,0.0,1.0,0.0
WALTER, Let's take that hill!,0.0,0.0,1.0,0.0
DUDE,WE HAVE IT!,0.0,0.0,1.0,0.0
DUDE, WE HAVE IT!!,0.0,0.0,1.0,0.0
DUDE,WE HAVE IT!!. . . We have it!,0.0,0.0,1.0,0.0
WALTER,"Ahh fuck it, let's go bowling.",-0.5423,0.412,0.588,0.0
WALTER,"Aitz chaim he, Dude. ",0.0,0.0,1.0,0.0
WALTER,As the ex used to say.,0.0,0.0,1.0,0.0
DUDE,What the fuck is that supposed to mean?,-0.5423,0.333,0.667,0.0
DUDE,What the fuck're we gonna tell Lebowski?,0.0,0.0,1.0,0.0
WALTER,Huh?,0.0,0.0,1.0,0.0
WALTER,"Oh, him, yeah. ",0.296,0.0,0.476,0.524
WALTER,"Well I don't see, um-- what exactly is the problem?",-0.1531,0.211,0.625,0.164
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,The problem is--what do you mean what's the--there's no--we didn't--they're gonna kill that poor woman--,-0.2644,0.269,0.557,0.174
WALTER,What the fuck're you talking about?,0.0,0.0,1.0,0.0
WALTER,"That poor woman--that poor slut--kidnapped herself, Dude. ",-0.7351,0.554,0.446,0.0
WALTER,You said so yourself--,0.0,0.0,1.0,0.0
DUDE,"No, Walter!",0.0,0.0,1.0,0.0
DUDE, I said I thought she kidnapped herself!,0.0,0.0,1.0,0.0
DUDE, You're the one who's so fucking certain--,0.3962,0.0,0.692,0.308
WALTER,"That's right, Dude, 1  % certain--",0.2732,0.0,0.704,0.296
DONNY,They posted the next round of the tournament--,0.0,0.0,1.0,0.0
WALTER,"Donny, shut the f--when do we play?",0.34,0.0,0.714,0.286
DONNY,This Saturday. ,0.0,0.0,1.0,0.0
DONNY,Quintana and--,0.0,0.0,1.0,0.0
WALTER,Saturday!,0.0,0.0,1.0,0.0
WALTER, Well they'll have to reschedule.,0.2732,0.0,0.656,0.344
DUDE,"Walter, what'm I gonna tell Lebowski?",0.0,0.0,1.0,0.0
WALTER,I told that fuck down at the league office-- who's in charge of scheduling?,-0.5423,0.212,0.788,0.0
DUDE,Walter--,0.0,0.0,1.0,0.0
DONNY,Burkhalter.,0.0,0.0,1.0,0.0
WALTER,I told that kraut a fucking thousand times I don't roll on shabbas.,0.0,0.0,1.0,0.0
DONNY,It's already posted.,0.0,0.0,1.0,0.0
WALTER,WELL THEY CAN FUCKING UN-POST IT!,0.3382,0.0,0.676,0.324
DUDE,"Who gives a shit, Walter?",-0.5574,0.474,0.526,0.0
DUDE,What about that poor woman?,-0.4767,0.437,0.563,0.0
DUDE,What do we tell--,0.0,0.0,1.0,0.0
WALTER,"C'mon Dude, eventually she'll get sick of her little game and, you know, wander back--",-0.5106,0.191,0.809,0.0
DONNY,"How come you don't roll on Saturday, Walter?",0.0,0.0,1.0,0.0
WALTER,I'm shomer shabbas.,0.0,0.0,1.0,0.0
DONNY,"What's that, Walter?",0.0,0.0,1.0,0.0
DUDE,"Yeah, and in the meantime what do I tell Lebowski?",0.296,0.0,0.804,0.196
WALTER,Saturday is shabbas. ,0.0,0.0,1.0,0.0
WALTER,Jewish day of rest. ,0.0,0.0,1.0,0.0
WALTER,"Means I don't work, I don't drive a car, I don't fucking ride in a car, I don't handle money, I don't turn on the oven, and I sure as shit don't fucking roll!",-0.3802,0.102,0.838,0.06
DONNY,Sheesh.,0.0,0.0,1.0,0.0
DUDE,"Walter, how--",0.0,0.0,1.0,0.0
WALTER,Shomer shabbas.,0.0,0.0,1.0,0.0
DUDE,That's it. ,0.0,0.0,1.0,0.0
DUDE,I'm out of here.,0.0,0.0,1.0,0.0
WALTER,"For Christ's sake, Dude.",0.0,0.0,1.0,0.0
DONNY,"Oh yeah, how'd it go?",0.296,0.0,0.645,0.355
WALTER,Went alright. ,0.25,0.0,0.333,0.667
WALTER,Dude's car got a little dinged up--,0.0,0.0,1.0,0.0
DUDE,"But Walter, we didn't make the fucking hand- off!",0.7211,0.0,0.614,0.386
DUDE," They didn't get, the fucking money and they're gonna--they're gonna--",0.0,0.0,1.0,0.0
WALTER,"Yeah yeah, ""kill that poor woman.""",-0.6597,0.549,0.141,0.31
WALTER,Kill that poor woman.,-0.8316,0.796,0.204,0.0
DONNY,"Walter, if you can't ride in a car, how d'you get around on Shammas--",0.0,0.0,1.0,0.0
WALTER,"Really, Dude, you surprise me. ",0.3321,0.0,0.629,0.371
WALTER,They're not gonna kill shit. ,0.7692,0.0,0.31,0.69
WALTER,They're not gonna do shit. ,0.4449,0.0,0.578,0.422
WALTER,What can they do?,0.0,0.0,1.0,0.0
WALTER,Fuckin' amateurs. ,0.0,0.0,1.0,0.0
WALTER,"And meanwhile, look at the bottom line. ",0.0,0.0,1.0,0.0
WALTER,Who's sitting on a million fucking dollars?,0.0,0.0,1.0,0.0
WALTER,Am I wrong?,-0.4767,0.608,0.392,0.0
DUDE,Walter--,0.0,0.0,1.0,0.0
WALTER,Who's got a fucking million fucking dollars parked in the trunk of our car out here?,0.0,0.0,1.0,0.0
DUDE,"""Our"" car, Walter?",0.0,0.0,1.0,0.0
WALTER,"And what do they got, Dude?",0.0,0.0,1.0,0.0
WALTER,My dirty undies. ,-0.4404,0.592,0.408,0.0
WALTER,"My fucking whites--Say, where is  the car?",0.0,0.0,1.0,0.0
DONNY,"Who has your undies, Walter?",0.0,0.0,1.0,0.0
WALTER,"Where's your car, Dude?",0.0,0.0,1.0,0.0
DUDE,"You don't know, Walter?",0.0,0.0,1.0,0.0
DUDE,You seem to know the answer to everything else!,0.0,0.0,1.0,0.0
WALTER,Hmm. ,0.0,0.0,1.0,0.0
WALTER,"Well, we were in a handicapped spot. ",0.2732,0.0,0.741,0.259
WALTER,"It, uh, it was probably towed.",0.0,0.0,1.0,0.0
DUDE,"It's been stolen, Walter!",-0.5411,0.538,0.462,0.0
DUDE, You fucking know it's been stolen!,-0.5411,0.411,0.589,0.0
WALTER,"Well, certainly that's a possibility, Dude--",0.5423,0.0,0.471,0.529
DUDE,"Aw, fuck it.",-0.5423,0.636,0.364,0.0
DONNY,"Where you going, Dude?",0.0,0.0,1.0,0.0
DUDE,"I'm going home, Donny.",0.0,0.0,1.0,0.0
DONNY,"Your phone's ringing, Dude.",0.0,0.0,1.0,0.0
DUDE,"Thank you, Donny.",0.3612,0.0,0.444,0.556
DUDE,1972 Pontiac LeBaron.,0.0,0.0,1.0,0.0
DUDE,Green. ,0.0,0.0,1.0,0.0
DUDE,"Some brown, or, uh, rust, coloration.",0.0,0.0,1.0,0.0
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,Oh. ,0.0,0.0,1.0,0.0
DUDE,Yeah. ,0.296,0.0,0.0,1.0
DUDE,Tape deck. ,0.0,0.0,1.0,0.0
DUDE,Couple of Creedence tapes. ,0.0,0.0,1.0,0.0
DUDE,"And there was a, uh. . . my briefcase.",0.0,0.0,1.0,0.0
DUDE,Papers. ,0.0,0.0,1.0,0.0
DUDE,Just papers. ,0.0,0.0,1.0,0.0
DUDE,"You know, my papers. ",0.0,0.0,1.0,0.0
DUDE,Business papers.,0.0,0.0,1.0,0.0
DUDE,I'm unemployed.,0.0,0.0,1.0,0.0
DUDE,"...Me, I don't drink coffee. ",0.0,0.0,1.0,0.0
DUDE,But it's nice when they offer.,0.5719,0.0,0.575,0.425
DUDE,"...Also, my rug was stolen.",-0.4939,0.444,0.556,0.0
DUDE,No. ,0.0,0.0,1.0,0.0
DUDE,Here.,0.0,0.0,1.0,0.0
DUDE,You find them much?,0.0,0.0,1.0,0.0
DUDE,Stolen cars?,-0.4939,0.762,0.238,0.0
DUDE,"And the, uh, the briefcase?",0.0,0.0,1.0,0.0
MAUDE,"Mr. Lebowski, I'd like to see you. ",0.3612,0.0,0.706,0.294
MAUDE,Call when you get home and I'll send a car for you. ,0.0,0.0,1.0,0.0
MAUDE,My name is Maude Lebowski. ,0.0,0.0,1.0,0.0
MAUDE,I'm the woman who took the rug.,0.0,0.0,1.0,0.0
DUDE,Is that what that's a picture of?,0.0,0.0,1.0,0.0
MAUDE,"In a sense, yes. ",0.4019,0.0,0.526,0.474
MAUDE,"Elfranco, my robe. My art has been commended as being strongly vaginal. ",0.6124,0.0,0.667,0.333
MAUDE,Which bothers some men. ,-0.2023,0.375,0.625,0.0
MAUDE,The word itself makes some men uncomfortable. ,-0.3818,0.302,0.698,0.0
MAUDE,Vagina.,0.0,0.0,1.0,0.0
DUDE,Oh yeah?,0.296,0.0,0.312,0.688
MAUDE,"Yes, they don't like hearing it and find it difficult to say. ",-0.2287,0.283,0.552,0.166
MAUDE,"Whereas without batting an eye a man will refer to his ""dick"" or his ""rod"" or his ""Johnson"".",-0.5106,0.163,0.837,0.0
DUDE,"""Johnson""?",0.0,0.0,1.0,0.0
MAUDE,Thank you.,0.3612,0.0,0.286,0.714
DUDE,Huh?,0.0,0.0,1.0,0.0
MAUDE,"Yes, I know about it. ",0.4019,0.0,0.597,0.403
MAUDE,And I know that you acted as courier. ,0.0,0.0,1.0,0.0
MAUDE,And let me tell you something:  the whole thing stinks to high heaven.,0.3182,0.123,0.675,0.202
DUDE,"Right, but let me explain something about that rug--",0.0,0.0,1.0,0.0
MAUDE,"Do you like sex, Mr. Lebowski?",0.3612,0.0,0.667,0.333
DUDE,Excuse me?,0.0772,0.0,0.435,0.565
MAUDE,Sex. ,0.0,0.0,1.0,0.0
MAUDE,The physical act of love. ,0.6369,0.0,0.488,0.512
MAUDE,Coitus. ,0.0,0.0,1.0,0.0
MAUDE,Do you like it?,0.3612,0.0,0.545,0.455
DUDE,I was talking about my rug.,0.0,0.0,1.0,0.0
MAUDE,You're not interested in sex?,-0.3089,0.361,0.639,0.0
DUDE,You mean coitus?,0.0,0.0,1.0,0.0
MAUDE,I like it too. ,0.3612,0.0,0.545,0.455
MAUDE,It's a male myth about feminists that we hate sex. ,-0.5719,0.291,0.709,0.0
MAUDE,"It can be a natural, zesty enterprise. But unfortunately there are some people--it is called satyriasis in men, nymphomania in women--who engage in it compulsively and without joy.",-0.52,0.2,0.666,0.135
DUDE,"Oh, no.",0.0,0.0,1.0,0.0
MAUDE,"Yes Mr. Lebowski, these unfortunate souls cannot love in the true sense of the word. ",-0.2187,0.278,0.481,0.241
MAUDE,Our mutual acquaintance Bunny is one of these.,0.0,0.0,1.0,0.0
DUDE,"Listen, Maude, I'm sorry if your stepmother is a nympho, but I don't see what it has to do with--do you have any kalhua?",-0.0387,0.048,0.952,0.0
MAUDE,"Take a look at this, sir.",0.0,0.0,1.0,0.0
DUDE,"Shit, I know that guy. ",-0.5574,0.474,0.526,0.0
DUDE,He's a nihilist.,0.0,0.0,1.0,0.0
MAUDE,"And you recognize her, of course.",0.0,0.0,1.0,0.0
MAUDE,The story is ludicrous.,-0.3612,0.455,0.545,0.0
MAUDE,Lord. ,0.0,0.0,1.0,0.0
MAUDE,You can imagine where it goes from here.,0.0,0.0,1.0,0.0
DUDE,He fixes the cable?,0.0,0.0,1.0,0.0
MAUDE,"Don't be fatuous, Jeffrey. ",0.0,0.0,1.0,0.0
MAUDE,Little matter to me that this woman chose to pursue a career,-0.0498,0.098,0.902,0.0
DUDE,"Shit yeah, the achievers.",-0.34,0.462,0.256,0.282
MAUDE,"Little Lebowski Urban Achievers, yes, and proud we are of all of them. ",0.7003,0.0,0.655,0.345
MAUDE,"I asked my father about his withdrawal of a million dollars from the Foundation account and he told me about this ""abduction"", but I tell you it is preposterous. ",-0.4019,0.089,0.877,0.034
MAUDE,This compulsive,0.0,0.0,1.0,0.0
DUDE,"Yeah, but my-",0.1531,0.0,0.556,0.444
MAUDE,"I'm getting to your rug. My  father and I don't get along; he doesn't approve of my lifestyle and, needless to say, I don't approve of his. ",0.0,0.0,1.0,0.0
MAUDE,"Still, I hardly wish to make my father's embezzlement a police matter, so I'm proposing that you try to recover the money from the people you delivered it to.",0.3626,0.0,0.885,0.115
DUDE,"Well--sure, I could do that--",0.0,0.0,1.0,0.0
MAUDE,"If you successfully do so, I will compensate you to the tune of 1% of the recovered sum.",0.4939,0.0,0.842,0.158
DUDE,A hundred.,0.0,0.0,1.0,0.0
MAUDE,"Thousand, yes, bones or clams or whatever you call them.",0.4019,0.0,0.769,0.231
DUDE,"Yeah, but what about--",0.1531,0.0,0.652,0.348
MAUDE,"--your rug, yes, well with that money you can buy any number of rugs that don't have sentimental value for me. ",0.2737,0.153,0.613,0.234
MAUDE,And I am sorry about that crack on the jaw.,-0.0772,0.126,0.874,0.0
DUDE,"Oh that's okay, I hardly even--",0.2263,0.0,0.725,0.275
MAUDE,Here's the name and number of a doctor who will look at it for you. ,0.0772,0.0,0.915,0.085
MAUDE,You will receive no bill. ,-0.296,0.355,0.645,0.0
MAUDE,"He's a good man, and thorough.",0.4404,0.0,0.633,0.367
DUDE,That's really thoughtful but I--,0.2374,0.0,0.673,0.327
MAUDE,"Please see him, Jeffrey. ",0.3182,0.0,0.566,0.434
MAUDE,"He's a good man, and thorough.",0.4404,0.0,0.633,0.367
DUDE,"Fuckin' A, man. ",0.0,0.0,1.0,0.0
DUDE,"I got a rash.			 Fuckin' A, man. ",-0.4019,0.31,0.69,0.0
DUDE,I gotta tell ya Tony.,0.0,0.0,1.0,0.0
DUDE,"Yeah, man!",0.3595,0.0,0.286,0.714
DUDE, Fuck it!,-0.5848,0.791,0.209,0.0
DUDE, I can't be worrying about that shit. ,-0.3744,0.338,0.47,0.191
DUDE,Life goes on!,0.0,0.0,1.0,0.0
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,When did he-,0.0,0.0,1.0,0.0
DUDE,"Fuck, man!",-0.5848,0.791,0.209,0.0
DUDE, There's a beverage here!,0.0,0.0,1.0,0.0
LEBOWSKI,Start talking and talk fast you lousy bum!,-0.5848,0.351,0.649,0.0
LEBOWSKI,"Where's my goddamn money, you bum?!",-0.5255,0.404,0.596,0.0
DUDE,Well we--I don't--,0.2732,0.0,0.488,0.512
LEBOWSKI,"They did not receive the money, you nitwit!",0.0,0.0,1.0,0.0
LEBOWSKI, They  did not receive the goddamn money. ,0.3724,0.0,0.701,0.299
LEBOWSKI,HER LIFE WAS IN YOUR HANDS!,0.0,0.0,1.0,0.0
DUDE,"No, man, nothing is fucked here--",0.5448,0.0,0.587,0.413
LEBOWSKI,NOTHING IS FUCKED!,0.587,0.0,0.344,0.656
LEBOWSKI,THE GODDAMN PLANE HAS CRASHED INTO THE MOUNTAIN!,-0.5255,0.326,0.674,0.0
DUDE,"C'mon man, who're you gonna believe?",0.0,0.0,1.0,0.0
DUDE,Those guys are--we dropped off the damn money--,-0.4019,0.278,0.722,0.0
LEBOWSKI,WHAT?!,0.0,0.0,1.0,0.0
DUDE,"I--the royal we, you know, the editorial--I dropped off the money, exactly as per--Look, I've got certain information, certain things have come to light, and uh, has it ever occurred to you, man, that given the nature of all this new shit, that, uh, instead of running around blaming me, that this whole thing might just be, not, you know, not just such a simple, but uh--you know?",-0.3182,0.062,0.895,0.043
LEBOWSKI,What in God's holy name are you blathering about?,0.0,0.0,1.0,0.0
DUDE,I'll tell you what I'm blathering about!,0.0,0.0,1.0,0.0
DUDE," I got information--new shit has come to light and--shit, man!",-0.5983,0.302,0.698,0.0
DUDE, She kidnapped herself!,0.0,0.0,1.0,0.0
DUDE,"Well sure, look at it!",0.5707,0.0,0.39,0.61
DUDE," Young trophy wife, I mean, in the parlance of our times, owes money all over town, including to known pornographers--and that's cool, that's cool-- but I'm saying, she needs money, and of course they're gonna say they didn't get it 'cause she wants more, man, she's gotta feed the monkey, I mean--hasn't that ever occurred to you...?",0.3182,0.0,0.943,0.057
DUDE,Sir?,0.0,0.0,1.0,0.0
LEBOWSKI,No. ,0.0,0.0,1.0,0.0
LEBOWSKI,"No Mr. Lebowski, that had not occurred to me.",-0.296,0.216,0.784,0.0
DUDE,"Well, okay, you're not privy to all the new shit, so uh, you know, but that's what you pay me for. ",-0.2263,0.163,0.711,0.126
DUDE,"Speaking of which, would it be possible for me to get my twenty grand in cash?",0.4588,0.0,0.833,0.167
DUDE,"I gotta check this with my accountant of course, but my concern is that, you know, it could bump me into a higher tax--",0.0,0.0,1.0,0.0
LEBOWSKI,"Brandt, give him the envelope.",0.0,0.0,1.0,0.0
DUDE,"Well, okay, if you've already made out the check. ",0.4588,0.0,0.636,0.364
DUDE,Brandt is handing him a letter-sized envelope which is distended by something inside.,0.0,0.0,1.0,0.0
LEBOWSKI,"Since you have failed to achieve, even in the modest task that was your charge, since you have stolen my money, and since you have unrepentantly betrayed my trust.",-0.802,0.271,0.644,0.085
LEBOWSKI,"I have no choice but to tell these bums that they should do whatever is necessary to recover their money from you, Jeffrey Lebowski. ",-0.1531,0.065,0.935,0.0
LEBOWSKI,"And with Brandt as my witness, tell you this:  Any further harm visited upon Bunny, shall be visited tenfold upon your head.",-0.5423,0.143,0.857,0.0
LEBOWSKI,...By God sir. ,0.2732,0.0,0.488,0.512
LEBOWSKI,I will not abide another toe.,0.0,0.0,1.0,0.0
WALTER,That wasn't her toe.,0.0,0.0,1.0,0.0
DUDE,"Whose toe was it, Walter?",0.0,0.0,1.0,0.0
WALTER,How the fuck should I know?,-0.5423,0.412,0.588,0.0
WALTER,I do know that nothing about it indicates--,0.0,0.0,1.0,0.0
DUDE,"The nail polish, Walter.",0.0,0.0,1.0,0.0
WALTER,"Fine, Dude. ",0.2023,0.0,0.357,0.643
WALTER,"As if it's impossible to get some nail polish, apply it to someone else's toe--",0.0,0.0,1.0,0.0
DUDE,Someone else's--where the fuck are they gonna--,-0.5423,0.368,0.632,0.0
WALTER,You want a toe?,0.0772,0.0,0.698,0.302
WALTER,"I can get you a toe, believe me. ",0.0,0.0,1.0,0.0
WALTER,"There are ways, Dude. ",0.0,0.0,1.0,0.0
WALTER,"You don't wanna know about it, believe me.",0.0,0.0,1.0,0.0
DUDE,But Walter--,0.0,0.0,1.0,0.0
WALTER,I'll  get  you  a  toe by  this afternoon--with nail  polish. These  fucking amateurs. ,0.0,0.0,1.0,0.0
WALTER," They send us a  toe, we're  supposed to  shit our- selves with fear. ",-0.7783,0.382,0.618,0.0
WALTER,Jesus Christ. My  point is--,0.0,0.0,1.0,0.0
DUDE,"They're gonna kill her, Walter, and then they're gonna kill me--",-0.886,0.511,0.489,0.0
WALTER,"Well that's just, that's the stress talking, Dude. ",-0.1779,0.257,0.55,0.193
WALTER,So far we have what looks to me like a series of victimless crimes--,0.4767,0.0,0.745,0.255
DUDE,What about the toe?,0.0,0.0,1.0,0.0
WALTER,FORGET ABOUT THE FUCKING TOE!,-0.2942,0.354,0.646,0.0
WALTER,"Oh, please dear!",0.636,0.0,0.161,0.839
WALTER, I've got news for you: the Supreme Court has roundly rejected prior restraint!,0.1511,0.181,0.605,0.214
DUDE,"Walter, this isn't a First Amendment thing.",0.0,0.0,1.0,0.0
WALTER,"Lady, I got buddies who died face-down in the muck so you and I could enjoy this family restaurant!",-0.1759,0.162,0.706,0.133
DUDE,"All right, I'm leaving. ",0.0,0.0,1.0,0.0
DUDE,I'm sorry ma'am.,-0.0772,0.394,0.606,0.0
WALTER,"Don't run away from this, Dude!",0.0,0.0,1.0,0.0
WALTER," Goddamnit, this affects all of us!",0.0,0.0,1.0,0.0
WALTER,Our basic freedoms!,0.3595,0.0,0.445,0.555
WALTER,I'm staying. ,0.0,0.0,1.0,0.0
WALTER,Finishing my coffee.,0.0,0.0,1.0,0.0
WALTER,Finishing my coffee.,0.0,0.0,1.0,0.0
DUDE,Far out. ,0.0,0.0,1.0,0.0
DUDE,Far fuckin' out.,0.0,0.0,1.0,0.0
DUDE,Hunh?,0.0,0.0,1.0,0.0
DUDE,Hey!,0.0,0.0,1.0,0.0
DUDE," This is a private residence, man!",0.0,0.0,1.0,0.0
DUDE,Nice marmot.,0.4215,0.0,0.263,0.737
DUDE,Jesus!,0.0,0.0,1.0,0.0
DUDE,Jesus Christ!,0.0,0.0,1.0,0.0
DUDE,Excuse me?,0.0772,0.0,0.435,0.565
DUDE,My fucking briefcase!,0.0,0.0,1.0,0.0
DUDE, It's not here!,0.0,0.0,1.0,0.0
DUDE,My fucking briefcase!,0.0,0.0,1.0,0.0
DUDE, Jesus--what's that smell?,0.0,0.0,1.0,0.0
DUDE,When will you find these guys?,0.0,0.0,1.0,0.0
DUDE,"I mean, do you have any promising leads?",0.4019,0.0,0.722,0.278
DONNY,And then they're gonna stamp on it?!,0.0,0.0,1.0,0.0
WALTER,"Oh for Christ--will you shut the fuck up, Donny.",-0.5423,0.304,0.696,0.0
DUDE,I figure my only hope is that the big Lebowski kills me before the Germans can cut my dick off.,-0.7184,0.32,0.576,0.104
WALTER,"Now that is ridiculous, Dude. ",-0.3612,0.385,0.615,0.0
WALTER,No one is going to cut your dick off.,-0.765,0.559,0.441,0.0
DUDE,Thanks Walter.,0.4404,0.0,0.256,0.744
WALTER,Not if I have anything to say about it.,0.0,0.0,1.0,0.0
DUDE,"Yeah, thanks Walter. ",0.6249,0.0,0.164,0.836
DUDE,That gives me a very secure feeling.,0.5379,0.0,0.528,0.472
WALTER,Dude--,0.0,0.0,1.0,0.0
DUDE,That makes me feel all warm inside.,0.2263,0.0,0.759,0.241
WALTER,Now Dude--,0.0,0.0,1.0,0.0
DUDE,This whole fucking thing--I  could be sitting here with just pee-stains on my rug.,0.0,0.0,1.0,0.0
WALTER,Fucking Germans. ,0.0,0.0,1.0,0.0
WALTER,Nothing changes. ,0.0,0.0,1.0,0.0
WALTER,Fucking Nazis.,0.0,0.0,1.0,0.0
DONNY,"They were Nazis, Dude?",0.0,0.0,1.0,0.0
WALTER,"Come on, Donny, they were threatening castration!",-0.5707,0.381,0.619,0.0
DONNY,Uh-huh.,0.0,0.0,1.0,0.0
WALTER,Are you gonna split hairs?,0.0,0.0,1.0,0.0
DONNY,No--,0.0,0.0,1.0,0.0
WALTER,Am I wrong?,-0.4767,0.608,0.392,0.0
DONNY,Well--,0.2732,0.0,0.0,1.0
DUDE,They're nihilists.,0.0,0.0,1.0,0.0
WALTER,Huh?,0.0,0.0,1.0,0.0
DUDE,They kept saying they believe in nothing.,0.0,0.0,1.0,0.0
WALTER,Nihilists!,0.0,0.0,1.0,0.0
WALTER, Jesus.,0.0,0.0,1.0,0.0
DUDE,Yeah.,0.296,0.0,0.0,1.0
WALTER,"And let's also not forget--let's not forget, Dude--that keeping wildlife, an amphibious rodent, for uh, domestic, you know, within the city--that isn't legal either.",-0.2175,0.115,0.885,0.0
DUDE,"What're you, a fucking park ranger now?",0.0,0.0,1.0,0.0
WALTER,"No, I'm--",0.0,0.0,1.0,0.0
DUDE,Who gives a shit about the fucking marmot!,-0.5983,0.357,0.643,0.0
WALTER,"--We're sympathizing here, Dude--",0.0,0.0,1.0,0.0
DUDE,Fuck your sympathy!,-0.3164,0.52,0.137,0.343
DUDE," I don't need your sympathy, man, I need my fucking Johnson!",-0.3404,0.194,0.806,0.0
DONNY,"What do you need that for, Dude?",0.0,0.0,1.0,0.0
WALTER,"You gotta buck up, man, you can't go into the tournament with this negative attitude--",-0.657,0.238,0.762,0.0
DUDE,Fuck the tournament!,-0.5848,0.655,0.345,0.0
DUDE," Fuck you, Walter!",-0.5848,0.655,0.345,0.0
WALTER,Fuck the tournament?!,-0.5848,0.655,0.345,0.0
WALTER,Okay Dude. ,0.2263,0.0,0.345,0.655
WALTER,I can see you don't want to be cheered up. ,0.4728,0.098,0.639,0.264
WALTER,"C'mon Donny, let's go get a lane.",0.0,0.0,1.0,0.0
DUDE,"Another Caucasian, Gary.",0.0,0.0,1.0,0.0
DUDE,"Friends like these, huh Gary.",0.6808,0.0,0.349,0.651
THE STRANGER,That's a good one.,0.4404,0.0,0.508,0.492
THE STRANGER,"How ya doin' there, Dude?",0.0,0.0,1.0,0.0
DUDE,"Ahh, not so good, man.",-0.464,0.431,0.569,0.0
THE STRANGER,"One a those days, huh. ",0.0,0.0,1.0,0.0
THE STRANGER,"Wal, a wiser fella than m'self once said, sometimes you eat the bar and sometimes the bar, wal, he eats you.",0.296,0.0,0.901,0.099
DUDE,Uh-huh. ,0.0,0.0,1.0,0.0
DUDE,That some kind of Eastern thing?,0.0,0.0,1.0,0.0
THE STRANGER,Far from it.,0.0,0.0,1.0,0.0
DUDE,Mm.,0.0,0.0,1.0,0.0
THE STRANGER,Much obliged.,0.0,0.0,1.0,0.0
THE STRANGER,"I like your style, Dude.",0.3612,0.0,0.615,0.385
DUDE,"Well I like your style too, man. ",0.5574,0.0,0.521,0.479
DUDE,Got a whole cowboy thing goin'.,0.0,0.0,1.0,0.0
THE STRANGER,"Thankie. . . Just one thing, Dude. ",0.0,0.0,1.0,0.0
THE STRANGER,D'ya have to use s'many cuss words?,0.0,0.0,1.0,0.0
DUDE,The fuck are you talking about?,-0.5423,0.412,0.588,0.0
THE STRANGER,"Okay, have it your way.",0.2263,0.0,0.678,0.322
THE STRANGER,"Take it easy, Dude.",0.4404,0.0,0.508,0.492
DUDE,Yeah. ,0.296,0.0,0.0,1.0
DUDE,Thanks man.,0.4404,0.0,0.256,0.744
MAUDE,"Jeffrey, you haven't gone to the doctor.",0.0,0.0,1.0,0.0
DUDE,"No it's fine, really, uh--",-0.4199,0.558,0.442,0.0
MAUDE,Do you have any news regarding my father's money?,0.0,0.0,1.0,0.0
DUDE,"I, uh... money, yeah, I gotta respecfully, 69 you know, tender my resignation on that matter, 'cause it looks like your mother really was kidnapped after all.",0.3818,0.071,0.742,0.187
MAUDE,She most certainly was not!,0.4561,0.0,0.573,0.427
DUDE,"Hey man, why don't you fucking listen occasionally?",0.0,0.0,1.0,0.0
DUDE,You might learn something. ,0.0,0.0,1.0,0.0
DUDE,Now I got--,0.0,0.0,1.0,0.0
MAUDE,And please don't call her my mother.,0.3182,0.0,0.723,0.277
DUDE,Now I got--,0.0,0.0,1.0,0.0
MAUDE,She is most definitely the perpetrator and not the victim.,0.0883,0.227,0.458,0.315
DUDE,"I'm telling you, I got definitive evidence--",0.0,0.0,1.0,0.0
MAUDE,From who?,0.0,0.0,1.0,0.0
DUDE,"The main guy, Dieter--",0.0,0.0,1.0,0.0
MAUDE,Dieter Hauff?,0.0,0.0,1.0,0.0
DUDE,"Well--yeah, I guess--",0.0,0.0,1.0,0.0
MAUDE,"Her ""co-star"" in the beaver picture?",0.0,0.0,1.0,0.0
DUDE,Beaver?,0.0,0.0,1.0,0.0
DUDE,"You mean vagina?--I mean, you know him?",0.0,0.0,1.0,0.0
MAUDE,"Dieter has been on the fringes of--well, of everything in L.A., for about twenty years. ",0.0,0.0,1.0,0.0
MAUDE,Look at my LP's. ,0.0,0.0,1.0,0.0
MAUDE,Under 'Autobahn.',0.0,0.0,1.0,0.0
MAUDE,That was his group--they released one album in the mid-seventies.,0.0,0.0,1.0,0.0
DUDE,Roy Orbison. . . Pink Floyd.,0.0,0.0,1.0,0.0
MAUDE,Huh?,0.0,0.0,1.0,0.0
MAUDE,Autobahn. ,0.0,0.0,1.0,0.0
MAUDE,A-u-t-o. ,0.0,0.0,1.0,0.0
MAUDE,Their music is a sort of--ugh--techno-pop.,0.0,0.0,1.0,0.0
DUDE,Jeez. ,0.0,0.0,1.0,0.0
DUDE,I miss vinyl.,-0.1531,0.444,0.556,0.0
MAUDE,Is he pretending to be the abductor?,0.1027,0.0,0.811,0.189
DUDE,Well...yeah--,0.0,0.0,1.0,0.0
MAUDE,"Look, Jeffrey, you don't really  kidnap someone that you're acquainted with. ",0.0,0.0,1.0,0.0
MAUDE,You can't get away with it if the hostage knows who you are.,0.0,0.0,1.0,0.0
DUDE,Well yeah...I know that.,0.2732,0.0,0.588,0.412
MAUDE,So Dieter has the money?,0.0,0.0,1.0,0.0
DUDE,"Well, no, not exactly. ",0.2732,0.0,0.588,0.412
DUDE,"It's a complicated case, Maude. ",0.0,0.0,1.0,0.0
DUDE,Lotta ins. ,0.0,0.0,1.0,0.0
DUDE,Lotta outs. ,0.0,0.0,1.0,0.0
DUDE,"And a lotta strands to keep in my head, man. ",0.0,0.0,1.0,0.0
DUDE,Lotta strands in old Duder's--,0.0,0.0,1.0,0.0
MAUDE,Do you still have that doctor's number?,0.0772,0.0,0.822,0.178
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,"No, really, I don't even have the bruise any more, I--",0.0,0.0,1.0,0.0
MAUDE,Please Jeffrey. ,0.3182,0.0,0.303,0.697
MAUDE,I don't want to be responsible for any delayed after-effects.,0.0459,0.251,0.564,0.185
DUDE,Delayed after-eff--,-0.2263,0.655,0.345,0.0
MAUDE,I want you to see him immediately.,0.0772,0.0,0.822,0.178
MAUDE,I'll see if he's available. ,0.0,0.0,1.0,0.0
MAUDE,"He's a good man, and thorough.",0.4404,0.0,0.633,0.367
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,"No, she, she hit me right here.",0.0,0.0,1.0,0.0
DUDE,Fuck Me.,-0.5423,0.778,0.222,0.0
DUDE,"Fuckola, man.",0.0,0.0,1.0,0.0
WALTER,"He lives in North Hollywood on Radford, near the In-and-Out Burger--",0.0,0.0,1.0,0.0
DUDE,The In-and-Out Burger is on Camrose.,0.0,0.0,1.0,0.0
WALTER,Near the In-and-Out Burger--,0.0,0.0,1.0,0.0
DONNY,"Those are good burgers, Walter.",0.4404,0.0,0.58,0.42
WALTER,"Shut the fuck up, Donny. ",-0.5423,0.467,0.533,0.0
WALTER,"This kid is in the ninth grade, Dude, and his father is--are you ready for this?--Arthur Digby Sellers.",0.3612,0.0,0.872,0.128
DUDE,Who the fuck is that?,-0.5423,0.467,0.533,0.0
WALTER,Huh?,0.0,0.0,1.0,0.0
DUDE,Who the fuck is Arthur Digby Sellers?,-0.5423,0.368,0.632,0.0
WALTER,"Who the f--have you ever heard of a little show called Branded, Dude?",0.0,0.0,1.0,0.0
DUDE,Yeah.,0.296,0.0,0.0,1.0
WALTER,All but one man died?,-0.7096,0.551,0.449,0.0
WALTER,There at Bitter Creek?,-0.4215,0.483,0.517,0.0
DUDE,"Yeah yeah, I know the fucking show Walter, so what?",0.5267,0.0,0.645,0.355
WALTER,"Fucking Arthur Digby Sellers wrote 156 episodes, Dude.",0.0,0.0,1.0,0.0
DUDE,Uh-huh.,0.0,0.0,1.0,0.0
WALTER,The bulk of the series.,0.0,0.0,1.0,0.0
DUDE,Uh-huh.,0.0,0.0,1.0,0.0
WALTER,Not exactly a lightweight.,0.0,0.0,1.0,0.0
DUDE,No.,0.0,0.0,1.0,0.0
WALTER,And yet his son is a fucking dunce.,0.0,0.0,1.0,0.0
DUDE,Uh.,0.0,0.0,1.0,0.0
WALTER,"Yeah, go figure. ",0.296,0.0,0.476,0.524
WALTER,"Well we'll go out there after the, uh, the.",0.2732,0.0,0.792,0.208
WALTER,What have you. ,0.0,0.0,1.0,0.0
WALTER,"We'll, uh--",0.0,0.0,1.0,0.0
DONNY,We'll be near the In-and-Out Burger.,0.0,0.0,1.0,0.0
WALTER,"Shut the fuck up, Donny. ",-0.5423,0.467,0.533,0.0
WALTER,"We'll, uh, brace the kid--he'll be a pushover. ",0.0,0.0,1.0,0.0
WALTER,"We'll get that fucking money, if he hasn't spent it already. ",0.0,0.0,1.0,0.0
WALTER,"Million fucking clams. And yes, we'll be near the, uh--some burgers, some beers, a few laughs. ",0.7322,0.0,0.694,0.306
WALTER,"Our fucking troubles are over, Dude.",-0.5095,0.397,0.603,0.0
DUDE,"Fuck me, man!",-0.5848,0.655,0.345,0.0
DUDE, That kid's already spent all the money!,0.0,0.0,1.0,0.0
WALTER,"Hardly Dude, a new 'vette?",0.0,0.0,1.0,0.0
WALTER,"The kid's still got, oh, 96 to 97 thousand, depending on the options. ",0.0,0.0,1.0,0.0
WALTER,"Wait in the car, Donny.",0.0,0.0,1.0,0.0
WALTER,"Hello, Pilar?",0.0,0.0,1.0,0.0
WALTER,"My name is Walter Sobchak, we spoke on the phone, this is my associate Jeffrey Lebowski.",0.0,0.0,1.0,0.0
WALTER,"May we uh, we wanted to talk about little Larry. ",0.0,0.0,1.0,0.0
WALTER,May we come in?,0.0,0.0,1.0,0.0
WALTER,"That's him, Dude.",0.0,0.0,1.0,0.0
WALTER,"Thank you, ma'am.",0.3612,0.0,0.444,0.556
WALTER,"Does he, uh. . . Is he still writing?",0.0,0.0,1.0,0.0
WALTER,Uh-huh.,0.0,0.0,1.0,0.0
WALTER,"I just want to say, sir, that we're both enormous--on a personal level, Branded, especially the early episodes, has been a source of, uh, inspir---",0.0772,0.0,0.949,0.051
WALTER,"No ma'am, I didn't mean to give the impression that we're police exactly. ",-0.0772,0.146,0.728,0.126
WALTER,We're hoping that it will not be necessary to call the police.,0.4215,0.0,0.797,0.203
WALTER,But that is up to little Larry here. ,0.0,0.0,1.0,0.0
WALTER,"Isn't it, Larry?",0.0,0.0,1.0,0.0
WALTER,"Is this your homework, Larry?",0.0,0.0,1.0,0.0
WALTER,"Is this your homework, Larry?",0.0,0.0,1.0,0.0
DUDE,"Look, man, did you--",0.0,0.0,1.0,0.0
WALTER,"Dude, please!. . . ",0.3802,0.0,0.536,0.464
WALTER,"Is this your homework, Larry?",0.0,0.0,1.0,0.0
DUDE,"Just ask him if he--ask him about the car, man!",0.0,0.0,1.0,0.0
WALTER,"Is this yours, Larry?",0.0,0.0,1.0,0.0
WALTER,"Is this your homework, Larry?",0.0,0.0,1.0,0.0
DUDE,Is the car out front yours?,0.0,0.0,1.0,0.0
WALTER,"Is this your homework, Larry?",0.0,0.0,1.0,0.0
DUDE,"We know it's his fucking homework, Walter!",0.0,0.0,1.0,0.0
DUDE," Where's the fucking money, you little brat?",0.0,0.0,1.0,0.0
WALTER,"Look, Larry. . . Have you ever heard of Vietnam?",0.0,0.0,1.0,0.0
DUDE,"Oh, for Christ's sake, Walter!",0.0,0.0,1.0,0.0
WALTER,"You're going to enter a world of pain, son. ",-0.5106,0.292,0.708,0.0
WALTER,We know that this is your homework. ,0.0,0.0,1.0,0.0
WALTER,We know you stole a car--,0.0,0.0,1.0,0.0
DUDE,And the fucking money!,0.0,0.0,1.0,0.0
WALTER,And the fucking money. ,0.0,0.0,1.0,0.0
WALTER,"And we know that this is your homework, Larry.",0.0,0.0,1.0,0.0
WALTER,"You're gonna KILL your FATHER, Larry!.",-0.7734,0.534,0.466,0.0
WALTER,"Ah, this is pointless.",0.0,0.0,1.0,0.0
WALTER,"All right, Plan B. ",0.0,0.0,1.0,0.0
WALTER,"You might want to watch out the front window there, Larry.",0.0772,0.0,0.885,0.115
WALTER,"This is what happens when you FUCK a STRANGER in the ASS, Larry.",-0.8579,0.435,0.565,0.0
WALTER,"Fucking language problem, Dude.",-0.4549,0.498,0.502,0.0
WALTER,Maybe he'll understand this.,0.0,0.0,1.0,0.0
WALTER,"YOU SEE WHAT HAPPENS, LARRY!",0.0,0.0,1.0,0.0
WALTER,YOU SEE WHAT HAPPENS?!,0.0,0.0,1.0,0.0
WALTER,THIS IS WHAT HAPPENS WHEN YOU FUCK A STRANGER IN THE ASS!,-0.807,0.422,0.578,0.0
WALTER,"HERE'S WHAT HAPPENS, LARRY!",0.0,0.0,1.0,0.0
WALTER,HERE'S WHAT HAPPENS!,0.0,0.0,1.0,0.0
WALTER, FUCK A STRANGER IN THE ASS!,-0.807,0.646,0.354,0.0
WALTER,Hunh?,0.0,0.0,1.0,0.0
DUDE,No!,0.0,0.0,1.0,0.0
DUDE, No!,0.0,0.0,1.0,0.0
DUDE, NO!,0.0,0.0,1.0,0.0
DUDE, THAT'S NOT--,0.0,0.0,1.0,0.0
DUDE,"I accept your apology. . . No I, I just want to handle it myself from now on. . . No. ",0.2263,0.091,0.7,0.21
DUDE,"That has nothing to do with it. . . .Yes, it made it home, I'm calling from home. ",0.4019,0.0,0.863,0.137
DUDE,"No, Walter, it didn't look like Larry was about to crack.",-0.2755,0.174,0.826,0.0
DUDE,"Well that's your perception. . . Well you're right, Walter, and the unspoken Message is FUCK YOU AND LEAVE ME THE FUCK ALONE. . . Yeah, I'll be at practice.",-0.8286,0.309,0.541,0.15
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,"This is quite a pad you got here, man. ",0.0,0.0,1.0,0.0
DUDE,Completely unspoiled.,0.0,0.0,1.0,0.0
DUDE,"White Russian, thanks. ",0.4404,0.0,0.408,0.592
DUDE,"How's the smut business, Jackie?",0.0,0.0,1.0,0.0
DUDE,Which one was Logjammin'?,0.0,0.0,1.0,0.0
DUDE,"On you, maybe.",0.0,0.0,1.0,0.0
DUDE,Uh-huh. ,0.0,0.0,1.0,0.0
DUDE,"Well, I still jerk off manually.",-0.0772,0.282,0.471,0.247
DUDE,"I thought you might know, man.",0.0,0.0,1.0,0.0
DUDE,"But she hasn't run off, she's been--",0.0,0.0,1.0,0.0
DUDE,"Yeah, well, right man, there are many facets to this, uh, you know, many interested parties. ",0.8271,0.0,0.553,0.447
DUDE,"If I can find your money, man-- what's in it for the Dude?",0.0,0.0,1.0,0.0
DUDE,Does the Pope shit in the woods?,-0.5574,0.375,0.625,0.0
DUDE,"Okay, Jackie, done. ",0.2263,0.0,0.513,0.487
DUDE,I like the way you do business. ,0.3612,0.0,0.706,0.294
DUDE,Your money is being held by a kid named Larry Sellers. ,0.0,0.0,1.0,0.0
DUDE,"He lives in North Hollywood, on Radford, near the In-and-Out Burger. ",0.0,0.0,1.0,0.0
DUDE,"A real fuckin' brat, but I'm sure your goons'll be able to get it off him, mean he's only fifteen and he's flunking social studies. ",-0.0772,0.111,0.788,0.101
DUDE,So if you'll just write me a check for my ten per cent. . . of half a million. . . fifty grand.,0.4588,0.0,0.88,0.12
DUDE,"I'll go out and mingle.--Jesus, you mix a hell of a Caucasian, Jackie.",-0.6808,0.277,0.723,0.0
DUDE,"No funny stuff, Jackie. . . the kid's got it. ",-0.3412,0.211,0.789,0.0
DUDE,"Hiya, fellas. . . kid just wanted a car. ",0.0,0.0,1.0,0.0
DUDE,All the Dude ever wanted. . . was his rug back. . . not greedy. . . it really.,0.2411,0.0,0.902,0.098
THE STRANGER,Darkness warshed over the Dude--darker'n a black steer's tookus on a moonless prairie night. ,-0.25,0.133,0.867,0.0
THE STRANGER,There was no bottom.,-0.296,0.423,0.577,0.0
DUDE,He was innocent. ,0.34,0.0,0.455,0.545
DUDE,Not a charge was true. ,0.4215,0.0,0.588,0.412
DUDE,And they say he ran awaaaaaay.,0.0,0.0,1.0,0.0
DUDE,I know my rights.,0.0,0.0,1.0,0.0
DUDE,"I want a fucking lawyer, man. ",0.0772,0.0,0.794,0.206
DUDE,I want Bill Kunstler.,0.0772,0.0,0.698,0.302
DUDE,Uh-huh.,0.0,0.0,1.0,0.0
DUDE,"That guy treats women like objects, man.",0.3612,0.0,0.706,0.294
DUDE,"I'm sorry, I wasn't listening.",-0.0772,0.245,0.755,0.0
DUDE,--Ow!,0.0,0.0,1.0,0.0
DUDE, Fucking fascist!,-0.6352,0.807,0.193,0.0
DUDE,"Jesus, man, can you change the station?",0.0,0.0,1.0,0.0
DUDE,I've had a--,0.0,0.0,1.0,0.0
DUDE,"--had a rough night, and I hate the fucking Eagles, man--",-0.5719,0.27,0.73,0.0
DUDE,Jesus.,0.0,0.0,1.0,0.0
MAUDE,Jeffrey.,0.0,0.0,1.0,0.0
DUDE,Maude?,0.0,0.0,1.0,0.0
MAUDE,Love me.,0.6369,0.0,0.192,0.808
DUDE,That's my robe.,0.0,0.0,1.0,0.0
MAUDE,"Tell me a little about yourself, Jeffrey.",0.0,0.0,1.0,0.0
DUDE,"Well, uh. . . Not much to tell.",0.2732,0.0,0.769,0.231
DUDE,"I was, uh, one of the authors of the Port Huron Statement.--The original Port Huron Statement.",0.3182,0.0,0.867,0.133
MAUDE,Uh-huh.,0.0,0.0,1.0,0.0
DUDE,Not the compromised second draft. ,0.0,0.0,1.0,0.0
DUDE,"And then I, uh. . . Ever hear of the Seattle Seven?",0.0,0.0,1.0,0.0
MAUDE,Mmnun.,0.0,0.0,1.0,0.0
DUDE,"And then. . . let's see, I uh--music business briefly.",0.0,0.0,1.0,0.0
MAUDE,Oh?,0.0,0.0,1.0,0.0
DUDE,Yeah. ,0.296,0.0,0.0,1.0
DUDE,Roadie for Metallica. ,0.0,0.0,1.0,0.0
DUDE,Speed of Sound Tour.,0.0,0.0,1.0,0.0
MAUDE,Uh-huh.,0.0,0.0,1.0,0.0
DUDE,Bunch of assholes. ,-0.5859,0.655,0.345,0.0
DUDE,"And then, you know, little of this, little of that. My career's, uh, slowed down a bit lately.",0.0,0.0,1.0,0.0
MAUDE,What do you do for fun?,0.5106,0.0,0.602,0.398
DUDE,"Oh, you know, the usual. ",0.0,0.0,1.0,0.0
DUDE,Bowl. ,0.0,0.0,1.0,0.0
DUDE,Drive around. ,0.0,0.0,1.0,0.0
DUDE,The occasional acid flashback.,0.0,0.0,1.0,0.0
MAUDE,What happened to your house?,0.0,0.0,1.0,0.0
DUDE,Jackie Treehorn trashed the place. ,0.0,0.0,1.0,0.0
DUDE,Wanted to save the finder's fee.,0.4939,0.0,0.61,0.39
MAUDE,Finder's fee?,0.0,0.0,1.0,0.0
DUDE,"He thought I had your father's money, so he got me out of the way while he looked for it.",0.0,0.0,1.0,0.0
MAUDE,"It's not my father's money, it's the Foundation's. ",0.0,0.0,1.0,0.0
MAUDE,Why did he think you had it?,0.0,0.0,1.0,0.0
MAUDE,And who does?,0.0,0.0,1.0,0.0
DUDE,"Larry Sellers, a high-school kid. ",0.0,0.0,1.0,0.0
DUDE,Real fucking brat.,0.0,0.0,1.0,0.0
MAUDE,Jeffrey--,0.0,0.0,1.0,0.0
DUDE,"It's a complicated case, Maude. ",0.0,0.0,1.0,0.0
DUDE,"Lotta ins, lotta outs. ",0.0,0.0,1.0,0.0
DUDE,"Fortunately I've been adhering to a pretty strict, uh, drug regimen to keep my mind, you know, limber. ",0.4939,0.0,0.842,0.158
DUDE,"I'm real fucking close to your father's money, real fucking close. ",0.0,0.0,1.0,0.0
DUDE,It's just--,0.0,0.0,1.0,0.0
MAUDE,"I keep telling you, it's the Foundation's money. ",0.0,0.0,1.0,0.0
MAUDE,Father doesn't have any.,0.0,0.0,1.0,0.0
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,He's fucking loaded.,0.0,0.0,1.0,0.0
MAUDE,"No no, the wealth was all Mother's.",0.25,0.212,0.481,0.308
DUDE,"But your father--he runs stuff, he--",0.0,0.0,1.0,0.0
MAUDE,"We did let Father run one of the companies, briefly, but he didn't do very well at it.",-0.3708,0.13,0.87,0.0
DUDE,But he's--,0.0,0.0,1.0,0.0
MAUDE,"He helps administer the charities now, and I give him a reasonable allowance. ",0.7003,0.0,0.655,0.345
MAUDE,He has no money of his own. ,-0.296,0.268,0.732,0.0
MAUDE,I know how he likes to present himself; Father's weakness is vanity. ,-0.2263,0.285,0.545,0.17
MAUDE,Hence the slut.,-0.5859,0.655,0.345,0.0
DUDE,Huh. ,0.0,0.0,1.0,0.0
DUDE,Jeez. ,0.0,0.0,1.0,0.0
DUDE,"Well, so, did he--is that yoga?",0.2732,0.0,0.704,0.296
MAUDE,It increases the chances of conception.,0.2023,0.0,0.735,0.265
DUDE,Increases?,0.0,0.0,1.0,0.0
MAUDE,"Well yes, what did you think this was all about?",0.5859,0.0,0.625,0.375
MAUDE,Fun and games?,0.5106,0.0,0.377,0.623
DUDE,"Well...no, of course not--",0.0,0.0,1.0,0.0
MAUDE,I want a child.,0.0772,0.0,0.698,0.302
DUDE,"Yeah, okay, but see, the Dude--",0.2617,0.0,0.567,0.433
MAUDE,"Look, Jeffrey, I don't want a partner. ",-0.0572,0.169,0.831,0.0
MAUDE,"In fact I don't want the father to be someone I have to see socially, or who'll have any interest in rearing the child himself.",0.4172,0.045,0.845,0.11
DUDE,Huh...,0.0,0.0,1.0,0.0
DUDE,So...that doctor.,0.0,0.0,1.0,0.0
MAUDE,Exactly. ,0.0,0.0,1.0,0.0
MAUDE,What happened to your face?,0.0,0.0,1.0,0.0
MAUDE,Did Jackie Treehorn do that as well?,0.2732,0.0,0.741,0.259
DUDE,"No, the, uh, police chief of Malibu. ",0.0,0.0,1.0,0.0
DUDE,"A real reactionary. . . So your father. . . Oh man, I get it!",0.0,0.0,1.0,0.0
MAUDE,What?,0.0,0.0,1.0,0.0
DUDE,"Yeah, my thinking about the case, man, it had become uptight. ",-0.1027,0.188,0.652,0.159
DUDE,Yeah. ,0.296,0.0,0.0,1.0
DUDE,Your father--,0.0,0.0,1.0,0.0
MAUDE,What're you talking about?,0.0,0.0,1.0,0.0
DUDE,"Walter, if you're there, pick up the fucking phone. ",0.0,0.0,1.0,0.0
DUDE,"Pick it up, Walter, this is an emergency. ",-0.3818,0.271,0.729,0.0
DUDE,I'm not--,0.0,0.0,1.0,0.0
WALTER,Dude?,0.0,0.0,1.0,0.0
DUDE,"Walter, listen, I'm at my place, I need you to come pick me up--",0.0,0.0,1.0,0.0
WALTER,"I can't drive, Dude, it's erev shabbas.",0.0,0.0,1.0,0.0
DUDE,Huh?,0.0,0.0,1.0,0.0
WALTER,Erev shabbas. ,0.0,0.0,1.0,0.0
WALTER,I can't drive. ,0.0,0.0,1.0,0.0
WALTER,"I'm not even supposed to pick up the phone, unless it's an emergency.",-0.3818,0.178,0.822,0.0
DUDE,It is a fucking emergency.,-0.4391,0.42,0.58,0.0
WALTER,I understand. ,0.0,0.0,1.0,0.0
WALTER,That's why I picked up the phone.,0.0,0.0,1.0,0.0
DUDE,"THEN WHY CAN'T YOU--fuck, never mind, just call Donny then, and ask him to--",0.0,0.0,1.0,0.0
WALTER,"Dude, I'm not supposed to make calls--",0.0,0.0,1.0,0.0
DUDE,"WALTER, YOU FUCKING ASSHOLE, WE GOTTA GO TO PASADENA!",0.0,0.0,1.0,0.0
DUDE, COME  PICK ME UP OR I'M OFF THE FUCKING BOWLING TEAM!,0.0,0.0,1.0,0.0
MAUDE,Jeffrey?,0.0,0.0,1.0,0.0
DUDE,"Get out of that fucking car, man!",0.0,0.0,1.0,0.0
DUDE,"Who the fuck are you, man!",-0.5848,0.431,0.569,0.0
DUDE," Come on, man!",0.0,0.0,1.0,0.0
DUDE,Who the fuck are you?,-0.5423,0.467,0.533,0.0
DUDE,Why've you been following me?,0.0,0.0,1.0,0.0
DUDE,"Come on, fuckhead!",-0.6588,0.687,0.313,0.0
DUDE,Brother Shamus?,0.0,0.0,1.0,0.0
DUDE,Like an Irish monk?,0.3612,0.0,0.545,0.455
DUDE,Huh?,0.0,0.0,1.0,0.0
DUDE,"I'm not a--ah, fuck it, just stay away from my fucking lady friend, man.",0.7452,0.0,0.655,0.345
DUDE,"She's not my special lady, she's my fucking lady friend. ",0.3005,0.164,0.582,0.253
DUDE,"I'm just helping her conceive, man!",0.3595,0.0,0.667,0.333
DUDE,Who're you working for?,0.0,0.0,1.0,0.0
DUDE,Lebowski?,0.0,0.0,1.0,0.0
DUDE,Jackie Treehorn?,0.0,0.0,1.0,0.0
DUDE,The?,0.0,0.0,1.0,0.0
DUDE,Who the fff--,0.0,0.0,1.0,0.0
DUDE,Jesus fucking Christ.,0.0,0.0,1.0,0.0
DUDE,Boy. ,0.0,0.0,1.0,0.0
DUDE,How ya gonna keep 'em down on the farm once they seen Karl Hungus.,0.0,0.0,1.0,0.0
DUDE,"Yeah, it sucks.",-0.0772,0.439,0.175,0.386
DUDE,"Yeah, I get it. ",0.296,0.0,0.577,0.423
DUDE,"Fuck off, Da Fino. ",-0.5423,0.538,0.462,0.0
DUDE,And stay away from my special la--from my fucking lady friend.,0.7334,0.0,0.593,0.407
DUDE,"I mean we totally fucked it up, man. ",-0.6901,0.401,0.599,0.0
DUDE,We fucked up his pay-off. ,-0.6597,0.524,0.476,0.0
DUDE,"And got the kidnappers all pissed off, and the big Lebowski yelled at me a lot, but he didn't do anything. ",-0.3818,0.115,0.885,0.0
DUDE,Huh?,0.0,0.0,1.0,0.0
WALTER,"Well it's, sometimes the cathartic, uh.",0.2732,0.0,0.704,0.296
DUDE,"I'm saying if he knows I'm a fuck-up, then why does he still leave me in charge of getting back his wife?",-0.0516,0.054,0.946,0.0
DUDE,"Because he fucking doesn't want her back, man!",-0.2004,0.204,0.796,0.0
DUDE, He's had enough!,0.0,0.0,1.0,0.0
DUDE, He no longer digs her!,-0.3595,0.384,0.616,0.0
DUDE, It's all a show!,0.0,0.0,1.0,0.0
DUDE," But then, why didn't he give a shit about his million bucks?",-0.7096,0.308,0.692,0.0
DUDE,"I mean, he knew we didn't hand off his briefcase, but he never asked for it back.",-0.2057,0.102,0.898,0.0
WALTER,"What's your point, Dude?",0.0,0.0,1.0,0.0
DUDE,"His million bucks was never in it, man!",0.0,0.0,1.0,0.0
DUDE, There was no money in that briefcase!,-0.3595,0.293,0.707,0.0
DUDE, He was hoping they'd kill her!,-0.4926,0.423,0.339,0.237
DUDE, You throw out a ringer for a ringer!,0.0,0.0,1.0,0.0
WALTER,Yeah?,0.296,0.0,0.0,1.0
DUDE,Shit yeah!,-0.4003,0.639,0.0,0.361
WALTER,"Okay, but how does all this add up to an emergency?",-0.4497,0.245,0.65,0.105
DUDE,Huh?,0.0,0.0,1.0,0.0
WALTER,"I'm saying, I see what you're getting at, Dude, he kept the money, but my point is, here we are, it's shabbas, the sabbath, which I'm allowed to break only if it's a matter of life and death--",-0.7351,0.126,0.847,0.027
DUDE,"Walter, come off it. ",0.0,0.0,1.0,0.0
DUDE,"You're not even fucking Jewish, you're--",0.0,0.0,1.0,0.0
WALTER,What the fuck are you talking about?,-0.5423,0.368,0.632,0.0
DUDE,You're fucking Polish Catholic--,0.0,0.0,1.0,0.0
WALTER,What the fuck are you talking about?,-0.5423,0.368,0.632,0.0
WALTER,I converted when I married Cynthia!,0.0,0.0,1.0,0.0
WALTER," Come on, Dude!",0.0,0.0,1.0,0.0
DUDE,"Yeah, and you were--",0.296,0.0,0.577,0.423
WALTER,You know this!,0.0,0.0,1.0,0.0
DUDE,And you were divorced five fucking years ago.,0.0,0.0,1.0,0.0
WALTER,Yeah?,0.296,0.0,0.0,1.0
WALTER,What do you think happens when you get divorced?,0.0,0.0,1.0,0.0
WALTER,You turn in your library card?,0.0,0.0,1.0,0.0
WALTER,Get a new driver's license?,0.0,0.0,1.0,0.0
WALTER,Stop being Jewish?,-0.296,0.524,0.476,0.0
DUDE,This driveway.,0.0,0.0,1.0,0.0
WALTER,I'm as Jewish as fucking Tevye,0.0,0.0,1.0,0.0
DUDE,It's just part of your whole sick Cynthia thing. ,-0.5106,0.292,0.708,0.0
DUDE,Taking care of her fucking dog. ,0.4939,0.0,0.61,0.39
DUDE,Going to her fucking synagogue. ,0.0,0.0,1.0,0.0
DUDE,You're living in the fucking past.,0.0,0.0,1.0,0.0
WALTER,"Three thousand years of beautiful tradition, from Moses to Sandy Koufax--YOU'RE GODDAMN RIGHT I LIVE IN THE PAST!",0.0923,0.16,0.666,0.174
WALTER,  I--Jesus. ,0.0,0.0,1.0,0.0
WALTER,What the hell happened?,-0.6808,0.605,0.395,0.0
WALTER,Jesus Christ.,0.0,0.0,1.0,0.0
DUDE,Where'd she been?,0.0,0.0,1.0,0.0
DUDE,But I guess she told Dieter.,0.0,0.0,1.0,0.0
WALTER,"Jesus, Dude!",0.0,0.0,1.0,0.0
WALTER, He never even kidnapped her.,0.0,0.0,1.0,0.0
WALTER,Who'm I?,0.0,0.0,1.0,0.0
WALTER,I'm a fucking VETERAN!,0.0,0.0,1.0,0.0
LEBOWSKI,"Well, she's back. ",0.2732,0.0,0.488,0.512
LEBOWSKI,No thanks to you.,-0.3412,0.445,0.555,0.0
DUDE,"Where's the money, Lebowski?",0.0,0.0,1.0,0.0
WALTER,A MILLION BUCKS FROM FUCKING NEEDY LITTLE URBAN ACHIEVERS!,-0.4561,0.272,0.728,0.0
WALTER," YOU ARE SCUM, MAN!",0.0,0.0,1.0,0.0
LEBOWSKI,Who the hell is he?,-0.6808,0.535,0.465,0.0
WALTER,I'll tell you who I am!,0.0,0.0,1.0,0.0
WALTER, I'm the guy who's gonna KICK YOUR PHONY GOLDBRICKING ASS!,-0.6731,0.335,0.665,0.0
DUDE,"We know the briefcase was empty, man. ",-0.2023,0.231,0.769,0.0
DUDE,We know you kept the million  bucks yourself.,0.0,0.0,1.0,0.0
LEBOWSKI,"Well, you have your story, I have mine. ",0.2732,0.0,0.769,0.231
LEBOWSKI,"I say I entrusted the money to you, and you stole it.",0.2023,0.0,0.859,0.141
WALTER,AS IF WE WOULD EVER DREAM OF TAKING YOUR BULLSHIT MONEY!,-0.4753,0.271,0.596,0.133
DUDE,You thought Bunny'd been kidnapped and you could use it as a pretext to make some money disappear. ,-0.2263,0.101,0.899,0.0
DUDE,"All you needed was a sap to pin it on, and you'd just met me. ",0.0,0.0,1.0,0.0
DUDE,"You thought, hey, a deadbeat, a loser, someone the square community won't give a shit about.",-0.122,0.167,0.689,0.144
LEBOWSKI,Well?,0.2732,0.0,0.0,1.0
LEBOWSKI,Aren't you?,0.0,0.0,1.0,0.0
DUDE,Well. . . yeah.,0.5106,0.0,0.317,0.683
LEBOWSKI,"All right, get out. ",0.0,0.0,1.0,0.0
LEBOWSKI,Both of you.,0.0,0.0,1.0,0.0
WALTER,"Look at that fucking phony, Dude!",0.0,0.0,1.0,0.0
WALTER, Pretending to be a fucking millionaire!,0.1759,0.0,0.747,0.253
LEBOWSKI,I said out. ,0.0,0.0,1.0,0.0
LEBOWSKI,Now.,0.0,0.0,1.0,0.0
WALTER,Let me tell you something else. ,0.0,0.0,1.0,0.0
WALTER,"I've seen a lot of spinals, Dude, and this guy is a fake. ",-0.4767,0.205,0.795,0.0
WALTER,A fucking goldbricker.,0.0,0.0,1.0,0.0
WALTER,This guy fucking walks. ,0.0,0.0,1.0,0.0
WALTER,I've never been more certain of anything in my life!,-0.3232,0.205,0.795,0.0
LEBOWSKI,"Stay away from me, mister!",0.0,0.0,1.0,0.0
WALTER,"Walk, you fucking phony!",0.0,0.0,1.0,0.0
LEBOWSKI,"Put me down, you son of a bitch!",-0.6239,0.369,0.631,0.0
DUDE,Walter!,0.0,0.0,1.0,0.0
WALTER,"It's all over, man!",0.0,0.0,1.0,0.0
WALTER, We call your fucking bluff!,0.0,0.0,1.0,0.0
DUDE,"WALTER, FOR CHRIST'S SAKE!",0.0,0.0,1.0,0.0
DUDE, HE'S CRIPPLED!,0.0,0.0,1.0,0.0
DUDE, PUT HIM DOWN!,0.0,0.0,1.0,0.0
WALTER,"Sure, I'll put him down, Dude. ",0.3182,0.0,0.685,0.315
WALTER,"RAUSS!ACHTUNG, BABY!!",0.0,0.0,1.0,0.0
WALTER,"Oh, shit.",-0.5574,0.783,0.217,0.0
LEBOWSKI,You're bullies!,0.0,0.0,1.0,0.0
LEBOWSKI," Cowards, both of you!",0.0,0.0,1.0,0.0
WALTER,"Oh, shit.",-0.5574,0.783,0.217,0.0
DUDE,"He can't walk, Walter!",0.0,0.0,1.0,0.0
WALTER,"Yeah, I can see that, Dude.",0.296,0.0,0.694,0.306
LEBOWSKI,You monsters!,0.0,0.0,1.0,0.0
DUDE,Help me put him back in his chair.,0.4019,0.0,0.722,0.278
WALTER,"Shit, sorry man.",-0.5994,0.831,0.169,0.0
LEBOWSKI,Stay away from me!,0.0,0.0,1.0,0.0
LEBOWSKI, You bullies!,0.0,0.0,1.0,0.0
LEBOWSKI, You and these women!,0.0,0.0,1.0,0.0
LEBOWSKI, You won't leave a man his fucking balls!,0.1129,0.0,0.829,0.171
DUDE,"Walter, you fuck!",-0.5848,0.655,0.345,0.0
WALTER,"Shit, Dude, I didn't know. ",-0.5574,0.474,0.526,0.0
WALTER,I wouldn't've done it if I knew he was a fucking crybaby.,0.0,0.0,1.0,0.0
DUDE,"We're sorry, man. ",-0.0772,0.394,0.606,0.0
DUDE,We're really sorry.,-0.1513,0.443,0.557,0.0
DUDE,There ya go. ,0.0,0.0,1.0,0.0
DUDE,Sorry man.,-0.0772,0.565,0.435,0.0
WALTER,Shit. ,-0.5574,1.0,0.0,0.0
WALTER,He didn't look like a spinal.,-0.2755,0.297,0.703,0.0
WALTER,Sure you'll see some tank battles. ,-0.0772,0.292,0.449,0.258
WALTER,But fighting in desert is very different from fighting in canopy jungle.,-0.7843,0.408,0.592,0.0
DUDE,Uh-huh.,0.0,0.0,1.0,0.0
WALTER,"I mean 'Nam was a foot soldier's war whereas, uh, this thing should be a fucking cakewalk. ",-0.5994,0.196,0.804,0.0
WALTER,"I mean I had an M16, Jacko, not an Abrams fucking tank. ",0.0,0.0,1.0,0.0
WALTER,"Just me and Charlie, man, eyeball to eyeball.",0.0,0.0,1.0,0.0
DUDE,Yeah.,0.296,0.0,0.0,1.0
WALTER,That's fuckin' combat. ,-0.4005,0.574,0.426,0.0
WALTER,"The man in the black pyjamas, Dude. ",0.0,0.0,1.0,0.0
WALTER,Worthy fuckin' adversary.,0.204,0.349,0.167,0.484
DONNY,"Who's in pyjamas, Walter?",0.0,0.0,1.0,0.0
WALTER,"Shut the fuck up, Donny. ",-0.5423,0.467,0.533,0.0
WALTER,Not a bunch of fig-eaters with towels on their heads tryin' to find reverse on a Soviet tank. ,0.0,0.0,1.0,0.0
WALTER,This is not a worthy--,-0.3412,0.376,0.624,0.0
QUINTANA,"What's this ""day of rest"" shit, man?!",-0.5983,0.393,0.607,0.0
QUINTANA,"What is this bullshit, man?",-0.6705,0.529,0.471,0.0
QUINTANA,I don't fucking care!,-0.4831,0.511,0.489,0.0
QUINTANA, It don't matter to Jesus!,-0.0941,0.255,0.745,0.0
QUINTANA, But you're not fooling me!,0.4903,0.0,0.557,0.443
QUINTANA," You might fool the fucks in the league office, but you don't fool Jesus!",0.103,0.233,0.598,0.169
QUINTANA, It's bush league psych-out stuff!,0.0,0.0,1.0,0.0
QUINTANA," Laughable, man!",0.126,0.0,0.401,0.599
QUINTANA," I would've fucked you in the ass Saturday, I'll fuck you in the ass next Wednesday instead!",-0.945,0.539,0.461,0.0
QUINTANA,"You got a date Wednesday, man!",0.0,0.0,1.0,0.0
WALTER,He's cracking.,0.0,0.0,1.0,0.0
WALTER,"A tree of life, Dude. ",0.0,0.0,1.0,0.0
WALTER,To all who cling to it.,0.0,0.0,1.0,0.0
DUDE,They finally did it. ,0.0,0.0,1.0,0.0
DUDE,They killed my fucking car.,-0.6705,0.529,0.471,0.0
DUDE,"You don't have the fucking girl, dipshits. ",0.0,0.0,1.0,0.0
DUDE,We know you never did. ,0.0,0.0,1.0,0.0
DUDE,So you've got nothin' on my Johnson.,0.0,0.0,1.0,0.0
DONNY,"Are these the Nazis, Walter?",0.0,0.0,1.0,0.0
WALTER,"They're nihilists, Donny, nothing to be afraid of.",0.0,0.0,1.0,0.0
WALTER,Fuck you. ,-0.5423,0.778,0.222,0.0
WALTER,Fuck the three of you.,-0.5423,0.467,0.533,0.0
DUDE,"Hey, cool it Walter.",0.3182,0.0,0.566,0.434
WALTER,There's no ransom if you don't have a fucking hostage. ,-0.296,0.196,0.804,0.0
WALTER,That's what ransom is. ,0.0,0.0,1.0,0.0
WALTER,Those are the fucking rules.,0.0,0.0,1.0,0.0
WALTER,NO RULES!,-0.3595,0.714,0.286,0.0
WALTER, YOU CABBAGE-EATING SONS-OF- BITCHES--,-0.5994,0.565,0.435,0.0
WALTER,Fair!,0.3802,0.0,0.0,1.0
WALTER, WHO'S THE FUCKING NIHILIST HERE!,0.0,0.0,1.0,0.0
WALTER," WHAT ARE YOU, A BUNCH OF FUCKING CRYBABIES?!",0.0,0.0,1.0,0.0
DUDE,"Hey, cool it Walter. ",0.3182,0.0,0.566,0.434
DUDE,"Listen, pal, there never was any money. ",0.0,0.0,1.0,0.0
DUDE,"The big Lebowski gave me an empty briefcase, man, so take it up with him.",-0.2023,0.114,0.886,0.0
WALTER,AND I'D LIKE MY UNDIES BACK!,0.4199,0.0,0.642,0.358
DONNY,"Are they gonna hurt us, Walter?",-0.5267,0.405,0.595,0.0
WALTER,"They won't hurt us, Donny. ",0.4168,0.0,0.59,0.41
WALTER,These men are cowards.,0.0,0.0,1.0,0.0
WALTER,Fuck you.,-0.5423,0.778,0.222,0.0
DUDE,"Come on, Walter, we're ending this thing cheap.",0.0,0.0,1.0,0.0
WALTER,What's mine is mine.,0.0,0.0,1.0,0.0
DUDE,"Come on, Walter!.",0.0,0.0,1.0,0.0
DUDE,Four dollars here!,0.0,0.0,1.0,0.0
DUDE,Almost five!,0.0,0.0,1.0,0.0
DONNY,"I got eighteen dollars, Dude.",0.0,0.0,1.0,0.0
WALTER,What's mine is mine.,0.0,0.0,1.0,0.0
WALTER,Come and get it.,0.0,0.0,1.0,0.0
WALTER,Come and get it. ,0.0,0.0,1.0,0.0
WALTER,Fucking nihilist.,0.0,0.0,1.0,0.0
WALTER,Show me what you got. ,0.0,0.0,1.0,0.0
WALTER,Nihilist. ,0.0,0.0,1.0,0.0
WALTER,Dipshit with a nine-toed woman.,-0.4767,0.437,0.563,0.0
WALTER,ANTI-SEMITE!,0.0,0.0,1.0,0.0
WALTER,"We've got a man down, Dude.",0.0,0.0,1.0,0.0
DUDE,Hy God!,0.3382,0.0,0.295,0.705
DUDE," They shot him, Walter!",0.0,0.0,1.0,0.0
WALTER,No Dude.,-0.296,0.688,0.312,0.0
DUDE,They shot Donny!,0.0,0.0,1.0,0.0
WALTER,There weren't any shots.,0.0,0.0,1.0,0.0
DUDE,Then what's...,0.0,0.0,1.0,0.0
WALTER,It's a heart attack.,0.2732,0.333,0.215,0.452
DUDE,Wha.,0.0,0.0,1.0,0.0
WALTER,"Call the medics, Dude.",0.0,0.0,1.0,0.0
DUDE,Wha. . . Donny--,0.0,0.0,1.0,0.0
WALTER,Hurry Dude. ,0.0,0.0,1.0,0.0
WALTER,I'd go but I'm pumping blood. ,0.0,0.0,1.0,0.0
WALTER,Might pass out.,0.0,0.0,1.0,0.0
WALTER,"Rest easy, good buddy, you're doing fine. ",0.765,0.0,0.345,0.655
WALTER,We got help choppering in.,0.4019,0.0,0.597,0.403
DUDE,Yeah man.,0.296,0.0,0.312,0.688
DUDE,Jeffrey Lebowski.,0.0,0.0,1.0,0.0
WALTER,Walter Sobchak.,0.0,0.0,1.0,0.0
DUDE,"The Dude, actually. ",0.0,0.0,1.0,0.0
DUDE,"Is what, uh.",0.0,0.0,1.0,0.0
DUDE,Nothing.,0.0,0.0,1.0,0.0
WALTER,Yeah.,0.296,0.0,0.0,1.0
WALTER,Yeah.,0.296,0.0,0.0,1.0
WALTER,What's this?,0.0,0.0,1.0,0.0
WALTER,Don't need it. ,0.0,0.0,1.0,0.0
WALTER,We're scattering the ashes.,0.0,0.0,1.0,0.0
WALTER,This is a hundred and eighty dollars.,0.0,0.0,1.0,0.0
DUDE,Well can we--,0.2732,0.0,0.488,0.512
WALTER,A hundred and eighty dollars?!,0.0,0.0,1.0,0.0
WALTER,"Yeah, but we're--",0.1531,0.0,0.556,0.444
DUDE,Can we just rent it from you?,0.0,0.0,1.0,0.0
WALTER,We're scattering the fucking ashes!,0.0,0.0,1.0,0.0
DUDE,Walter--,0.0,0.0,1.0,0.0
WALTER,JUST BECAUSE WE'RE BEREAVED DOESN'T MEAN WE'RE SAPS!,-0.5255,0.326,0.674,0.0
DUDE,"Hey man, don't you have something else you could put it in?",0.0,0.0,1.0,0.0
WALTER,GODDAMNIT!,0.0,0.0,1.0,0.0
WALTER, IS THERE A RALPH'S AROUND HERE?!,0.0,0.0,1.0,0.0
WALTER,I'll say a few words.,0.0,0.0,1.0,0.0
WALTER,"Donny was a good bowler, and a good man. ",0.7003,0.0,0.547,0.453
WALTER,He was. . . He was one of us. ,0.0,0.0,1.0,0.0
WALTER,"He was a man who loved the outdoors, and bowling, and as a surfer explored the beaches of southern California from Redondo to Calabassos. ",0.5994,0.0,0.855,0.145
WALTER,And he was an avid bowler. ,0.296,0.0,0.694,0.306
WALTER,And a good friend. ,0.7269,0.0,0.247,0.753
WALTER,"He died--he died as so many of his generation, before his time. ",-0.5574,0.247,0.753,0.0
WALTER,"In your wisdom you took him, Lord. ",0.5267,0.0,0.638,0.362
WALTER,"As you took so many bright flowering young men, at Khe San and Lan Doc and Hill 364. ",0.4902,0.0,0.842,0.158
WALTER,These young men gave their lives. ,0.0,0.0,1.0,0.0
WALTER,And Donny too. ,0.0,0.0,1.0,0.0
WALTER,Donny who. . . who loved bowling.,0.5994,0.0,0.606,0.394
WALTER,"And so, Theodore--Donald--Karabotsos, in accordance with what we think   your dying wishes might well have been, we commit your mortal remains to the bosom of.",0.5994,0.0,0.789,0.211
WALTER,"the Pacific Ocean, which you loved so well.",0.7678,0.0,0.475,0.525
WALTER,"Goodnight, sweet prince.",0.4588,0.0,0.4,0.6
WALTER,"Shit, I'm sorry Dude.",-0.5994,0.71,0.29,0.0
WALTER,Goddamn wind.,-0.4767,0.756,0.244,0.0
DUDE,Goddamnit Walter!,0.0,0.0,1.0,0.0
DUDE, You fucking asshole!,0.0,0.0,1.0,0.0
WALTER,Dude!,0.0,0.0,1.0,0.0
WALTER," Dude, I'm sorry!",-0.1511,0.443,0.557,0.0
DUDE,You make everything a fucking travesty!,-0.6468,0.461,0.539,0.0
WALTER,"Dude, I'm--it was an accident!",-0.5255,0.459,0.541,0.0
DUDE,What about that shit about Vietnam!,-0.5983,0.438,0.562,0.0
WALTER,"Dude, I'm sorry--",-0.0772,0.394,0.606,0.0
DUDE,What the fuck does Vietnam have to do with anything!,-0.5848,0.296,0.704,0.0
DUDE, What the fuck were you talking about?!,-0.5848,0.387,0.613,0.0
WALTER,"Shit Dude, I'm sorry--",-0.5994,0.71,0.29,0.0
DUDE,"You're a fuck, Walter!",-0.5848,0.558,0.442,0.0
WALTER,"Awww, fuck it Dude. ",-0.5423,0.538,0.462,0.0
WALTER,Let's go bowling.,0.0,0.0,1.0,0.0
DUDE,"Two oat sodas, Gary.",0.0,0.0,1.0,0.0
DUDE,"Thanks, man.",0.4404,0.0,0.256,0.744
DUDE,Yeah. ,0.296,0.0,0.0,1.0
DUDE,"Well, you know, sometimes you eat the bear, and, uh.",0.2732,0.0,0.811,0.189
THE STRANGER,"Howdy do, Dude.",0.0,0.0,1.0,0.0
DUDE,"Oh, hey man, how are ya?",0.0,0.0,1.0,0.0
DUDE,I wondered if I'd see you again.,0.0,0.0,1.0,0.0
THE STRANGER,Wouldn't miss the semis. ,0.1139,0.0,0.675,0.325
THE STRANGER,How things been goin'?,0.0,0.0,1.0,0.0
DUDE,"Ahh, you know. ",0.0,0.0,1.0,0.0
DUDE,"Strikes and gutters, ups and downs.",-0.3612,0.333,0.667,0.0
THE STRANGER,"Sure, I gotcha.",0.3182,0.0,0.465,0.535
DUDE,"Thanks, Gary...Take care, man, I gotta get back.",0.7269,0.0,0.496,0.504
THE STRANGER,Sure. ,0.3182,0.0,0.0,1.0
THE STRANGER,"Take it easy, Dude--I know that you will.",0.4404,0.0,0.707,0.293
DUDE,Yeah man. ,0.296,0.0,0.312,0.688
DUDE,"Well, you know, the Dude abides.",0.2732,0.0,0.704,0.296
THE STRANGER,The Dude abides.,0.0,0.0,1.0,0.0
THE STRANGER,"I don't know about you, but I take comfort in that. ",0.5023,0.0,0.755,0.245
THE STRANGER,"It's good knowin' he's out there, the Dude, takin' her easy for all us sinners. ",0.7003,0.0,0.691,0.309
THE STRANGER,Shoosh. ,0.0,0.0,1.0,0.0
THE STRANGER,I sure hope he makes The finals. ,0.6369,0.0,0.49,0.51
THE STRANGER,"Welp, that about does her, wraps her all up. ",0.0,0.0,1.0,0.0
THE STRANGER,"Things seem to've worked out pretty good for the Dude'n Walter, and it was a purt good story, dontcha think?",0.8402,0.0,0.654,0.346
THE STRANGER, Made me laugh to beat the band. ,0.5574,0.0,0.625,0.375
THE STRANGER,"Parts, anyway. ",0.0,0.0,1.0,0.0
THE STRANGER,"Course--I didn't like seein' Donny go. But then, happen to know that there's a little Lebowski on the way. ",-0.1419,0.08,0.92,0.0
THE STRANGER,"I guess that's the way the whole durned human comedy keeps perpetuatin' it-self, down through the generations, westward the wagons, across the sands a time until-- aw, look at me, I'm ramblin' again. ",0.3612,0.0,0.928,0.072
THE STRANGER,"Wal, uh hope you folks enjoyed yourselves.",0.7351,0.0,0.446,0.554
THE STRANGER,Catch ya further on down the trail.,0.0,0.0,1.0,0.0
`;

  const meanData = d3.csvParse(meanCSV, d3.autoType);
  const lineData = d3.csvParse(lineCSV, d3.autoType);

  // Clean column names (defensive)
  meanData.forEach(d => { d.compound = +d.compound; d.lines = +d.lines; });
  lineData.forEach(d => { d.compound = +d.compound; d.neg = +d.neg; d.neu = +d.neu; d.pos = +d.pos; });

  renderMean(meanData.filter(d => d.lines >= 5));
  renderLineByLine(lineData);

  // redraw on resize
  window.addEventListener('resize', () => {
    d3.select('#mean-chart').selectAll('*').remove();
    d3.select('#line-charts').selectAll('*').remove();
    renderMean(meanData);
    renderLineByLine(lineData);
  });

  function renderMean(data){
    const container = d3.select('#mean-chart');
    container.selectAll('*').remove();
    const width = container.node().clientWidth || 760;
    // dynamic mean chart height based on viewport (slightly larger)
    const height = Math.floor(window.innerHeight) * 0.25
    const margin = {top:20,right:20,bottom:20,left:20};
    // add extra bottom padding to prevent axis/labels from being clipped
    const svgHeight = height + margin.bottom;
    const svg = container.append('svg').attr('width', width).attr('height', svgHeight).style('overflow','visible');

    const xDomain = d3.extent(data, d=>d.compound);
    // if extent is too narrow, expand a little
    if (xDomain[0] === xDomain[1]) { xDomain[0] -= 0.1; xDomain[1] += 0.1; }

    const x = d3.scaleLinear().domain([Math.max(-1, xDomain[0]-0.05), Math.min(1, xDomain[1]+0.05)]).range([margin.left, width - margin.right]);
    const innerHeight = height - margin.top - margin.bottom;
    const yCenter = margin.top + innerHeight / 2;

    const color = d3.scaleLinear().domain([x.domain()[0], x.domain()[1]]).range(['#ff9a4d', '#3aa76d']);
    const r = d => Math.max(4, Math.sqrt(d.lines) * 4);

    // compute axis Y early so grid lines can span up to the axis
    const axisY = margin.top + innerHeight + 6

    // vertical grid lines behind the points
    const vTicks = x.ticks(7);
    svg.selectAll('.vline').data(vTicks).join('line')
      .attr('class', 'vline')
      .attr('x1', d => x(d))
      .attr('x2', d => x(d))
      .attr('y1', margin.top)
      .attr('y2', axisY)
      .attr('stroke', '#f6f6f6')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none');

    // center line (limited to plotting range so it doesn't extend outside the SVG)
    const xRange = [margin.left, width - margin.right];
    svg.append('line')
      .attr('x1', xRange[0])
      .attr('x2', xRange[1])
      .attr('y1', yCenter)
      .attr('y2', yCenter)
      .attr('stroke','#eee');

    // points
    const g = svg.append('g');

    g.selectAll('circle').data(data).join('circle')
      .attr('cx', d => x(d.compound))
      .attr('cy', d => yCenter)
      .attr('r', d => r(d))
      .attr('fill', d => color(d.compound))
      .attr('stroke', '#333')
      .attr('stroke-opacity', 0.15)
      .style('cursor','pointer')
      .on('mouseover', (event,d) => showTooltip(event, `<strong>${titleCase(d.Character)}</strong><br/>Lines: ${d.lines}<br/>Score: ${d.compound}`))
      .on('mousemove', (event) => moveTooltip(event))
      .on('mouseout', hideTooltip);

    // labels on hover are handled by tooltip
    // x axis
    const xAxis = d3.axisBottom(x).ticks(7);
    svg.append('g').attr('transform', `translate(0, ${axisY})`).call(xAxis);
    // x-axis label (below ticks)
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', axisY + 32)
      .attr('text-anchor', 'middle')
      .attr('fill', '#444')
      .style('font-size', '12px')
      .text('Mean Compound Sentiment Score');
 }

  function renderLineByLine(data){
    const container = d3.select('#line-charts');
    container.selectAll('*').remove();

    // unique characters and counts (sort by most lines)
    const counts = d3.rollup(data, v => v.length, d => d.Character);
    const chars = Array.from(new Set(data.map(d => d.Character)));
    chars.sort((a,b) => (counts.get(b) || 0) - (counts.get(a) || 0));

    // default characters (same as notebook)
    const defaults = ['DUDE','WALTER','DONNY','LEBOWSKI','MAUDE','THE STRANGER','QUINTANA'];

    function drawForSelection(){
      // use the hardcoded defaults (sorted by line counts)
      let toShow = defaults.slice().sort((a,b) => (counts.get(b) || 0) - (counts.get(a) || 0));
      container.selectAll('*').remove();

      const chartWidth = container.node().clientWidth || 760;
      // compute band height dynamically so total plot area fits the viewport (slightly larger bands)
      const minBand = 90, maxBand = 90;
      const reserved = 0;
      const availH = Math.max(200, window.innerHeight - reserved);
      const bandH = Math.max(minBand, Math.min(maxBand, Math.floor(availH / toShow.length)));
      const margin = {left:20, right:20, top:5, bottom:5};

      const x = d3.scaleLinear().domain([-1,1]).range([margin.left, chartWidth - margin.right]);
      const color = d3.scaleLinear().domain([-1,1]).range(['#ff9a4d','#3aa76d']);

      // prepare a background grid SVG that spans all bands so vertical lines connect across plots
      container.style('position', 'relative');
      // each band's actual SVG uses extra bottom space, reduce to keep bands tighter
      const bandSvgHeight = bandH + Math.max(28, margin.bottom);
      const gap = 0; // gap between bands (tighter)
      const totalHeight = (bandSvgHeight + gap) * toShow.length;
      const bg = container.append('svg')
        .attr('class', 'bg-grid')
        .attr('width', chartWidth)
        .attr('height', totalHeight)
        .style('position', 'absolute')
        .style('left', '0px')
        .style('top', '0px')
        .style('pointer-events', 'none')
        .style('z-index', 0);

      // draw vertical grid lines across full height
        const fullVTicks = filteredTicks(x, 5);
        bg.selectAll('.full-vline').data(fullVTicks).join('line')
          .attr('class', 'full-vline')
          .attr('x1', d => x(d))
          .attr('x2', d => x(d))
          .attr('y1', 0)
          .attr('y2', totalHeight)
          .attr('stroke', '#f6f6f6')
          .attr('stroke-width', 1)
          .attr('pointer-events', 'none');

      toShow.forEach((ch, idx) => {
        const rows = data.filter(d => d.Character === ch);
        const band = container.append('div').style('margin-bottom','0px');

        // give each band extra bottom space so ticks/labels fit and stacked dots are not clipped
        const svgHeight = bandH + Math.max(28, margin.bottom);
        const svg = band.append('svg').attr('width', '100%').attr('height', svgHeight)
          .style('position','relative')
          .style('z-index', 1);
        const innerH = bandH - margin.top - margin.bottom;
        const cy = margin.top + innerH / 2;
        const bandVJitter = 14; // total vertical jitter span (~±7)

        // put character name inside the plot (floating)
        svg.append('text')
          .attr('x', margin.left + 6)
          .attr('y', margin.top + 30)
          .style('font-weight', 600)
          .style('font-size', '13px')
          .text(titleCase(ch));

        // baseline at center of the band
        svg.append('line')
          .attr('x1', x(-1))
          .attr('x2', x(1))
          .attr('y1', cy)
          .attr('y2', cy)
          .attr('stroke', '#e6e6e6')
          .attr('stroke-width', 1);

        // per-band vertical grid lines removed — use the single background grid instead
        const axisY = margin.top + innerH + Math.max(12, bandVJitter / 2 + 6);

        // stack points vertically when compound scores are identical, and wrap into columns when stack is too tall
        const stackKey = d => (d && typeof d.compound === 'number') ? d.compound.toFixed(4) : '0.0000';
        const groups = d3.group(rows, stackKey);
        const nominalSpacing = 6; // prefer tighter vertical spacing
        const minimalSpacing = 2; // absolute minimal spacing
        const circleR = 4;
        // column spacing in px (horizontal offset per extra column) - keep tight
        const colSpacing = 8;

        const desiredRowsPerCol = 200; // target rows per column

        groups.forEach(g => {
          const n = g.length;
          // prefer desired rows per column
          let rowsPerCol = Math.min(n, desiredRowsPerCol);
          // compute spacing if we use rowsPerCol
          let spacing = (rowsPerCol > 1) ? (innerH / (rowsPerCol - 1)) : nominalSpacing;
          // clamp spacing to reasonable bounds (minimal..nominal)
          spacing = Math.max(minimalSpacing, Math.min(nominalSpacing, spacing));

          // if spacing is too large (because innerH big), still cap to nominal to keep stacks tight
          // if spacing is too small (< minimalSpacing) the clamp above ensures minimalSpacing

          // recompute rowsPerCol if spacing is minimal and many items remain
          if (spacing <= minimalSpacing) {
            // compute max rows that fit with minimal spacing
            const maxRows = Math.max(1, Math.floor((innerH - 8) / minimalSpacing));
            rowsPerCol = Math.min(n, Math.max(1, maxRows));
            spacing = (rowsPerCol > 1) ? (innerH / (rowsPerCol - 1)) : minimalSpacing;
            spacing = Math.max(minimalSpacing, Math.min(nominalSpacing, spacing));
          }

          const cols = Math.max(1, Math.ceil(n / rowsPerCol));
          g.forEach((item, i) => {
            const col = Math.floor(i / rowsPerCol);
            const idxInCol = i % rowsPerCol;
            item._stackCol = col;
            item._stackCols = cols;
            item._stackRowIndex = idxInCol;
            item._stackRowsPerCol = rowsPerCol;
            item._stackVSpacing = spacing;
          });
        });

        svg.selectAll('circle').data(rows).join('circle')
          .attr('cx', d => {
            const baseX = x(Math.max(-1, Math.min(1, d.compound || 0)));
            const col = d._stackCol || 0;
            const cols = d._stackCols || 1;
            // center columns horizontally on baseX
            const totalColsWidth = (cols - 1) * colSpacing;
            const xOffset = (col * colSpacing) - (totalColsWidth / 2);
            return baseX + xOffset;
          })
          .attr('cy', d => {
            const idx = d._stackRowIndex || 0;
            const count = d._stackRowsPerCol || 1;
            const spacing = d._stackVSpacing || nominalSpacing;
            const offset = (idx - (count - 1) / 2) * spacing;
            return cy + offset;
          })
          .attr('r', circleR)
          .attr('fill', d => color(d.compound || 0))
          .attr('stroke', '#222')
          .attr('stroke-opacity', 0.15)
          .on('mouseover', (event,d) => {
            const text = `<strong>${titleCase(ch)}</strong><br/>Score: ${d.compound}<br/>${(d.Line||'').toString().slice(0,300)}`;
            showTooltip(event, text);
          })
          .on('mousemove', (event) => moveTooltip(event))
          .on('mouseout', hideTooltip);

        // x axis only on last subplot
        if (idx === toShow.length - 1){
          const xAxis = d3.axisBottom(x).ticks(5);
          svg.append('g').attr('transform', `translate(0, ${axisY})`).call(xAxis);
          // axis label centered under last subplot
          svg.append('text')
            .attr('x', (chartWidth) / 2)
            .attr('y', axisY + 32)
            .attr('text-anchor', 'middle')
            .attr('fill', '#444')
            .style('font-size', '12px')
            .text('Compound Sentiment Score');
        }
      });
    }

    // no selector UI — draw using the hardcoded defaults
    drawForSelection();
  }

  let _tooltipHideTimer = null;

  function showTooltip(event, html) {
    if (_tooltipHideTimer) {
      clearTimeout(_tooltipHideTimer);
      _tooltipHideTimer = null;
    }
    // cancel any running hide transition so it doesn't hide this new tooltip
    tooltip.interrupt();
    tooltip.style('display', 'block')
      .html(html)
      .style('left', (event.clientX + 12) + 'px')
      .style('top', (event.clientY + 12) + 'px')
      .style('opacity', 1);
  }

  function moveTooltip(event) {
    if (_tooltipHideTimer) {
      clearTimeout(_tooltipHideTimer);
      _tooltipHideTimer = null;
    }
    // ensure any hide transition is cancelled so tooltip remains visible
    tooltip.interrupt();
    tooltip.style('left', (event.clientX + 12) + 'px').style('top', (event.clientY + 12) + 'px');
  }

  function hideTooltip() {
    if (_tooltipHideTimer) clearTimeout(_tooltipHideTimer);
    _tooltipHideTimer = setTimeout(() => {
      tooltip.transition().duration(120).style('opacity', 0).on('end', () => tooltip.style('display', 'none'));
      _tooltipHideTimer = null;
    }, 1);
  }
})();
