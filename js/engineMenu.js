var menu = {
    create: function(){
        this.app._settings_ = {
            name: 'Artjjom',
            color: '#D55',
            road: 0,
        };
     },
     
    step: function(){
        this.app.setState(ENGINE.main);
    },
};
