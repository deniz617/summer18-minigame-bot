(function() {
    // disable error messages
    GameLoadError = function() {};
    //const vars
    const maxStuck = 2; //2 == 3seconds, 3 == 4.5seconds, 4 == 6seconds..
    //vars-startup
    var gamesDone = 0, gID = "103582791441160348", stuck = 0;
    gServer.RepresentClan(gID, function(response){}, function(){console.log("Error on representing.");});
    // infinity loop
    setInterval(function(){
        // zone selection screen
        if ( typeof gGame.m_State.m_LeaveButton !== 'undefined') {
            for ( var diffCounter = 1; diffCounter <= 3; diffCounter++ ) { // hard, medium, easy
                for ( var zoneCounter = 0; zoneCounter < 96; zoneCounter++ ) {
                    if ( !gGame.m_State.m_PlanetData.zones[zoneCounter].captured &&
                          gGame.m_State.m_PlanetData.zones[zoneCounter].difficulty >= diffCounter ) {
                        gServer.JoinZone(
                            zoneCounter,
                            function ( results ) {
                                gGame.ChangeState( new CBattleState( gGame.m_State.m_PlanetData, zoneCounter ) );
                            },
                            GameLoadError
                        );
                        return;
                    }
                }
            }
        }
        // kill enemies
        if ( typeof gGame.m_State.m_EnemyManager !== 'undefined' ) {
            gGame.m_State.m_EnemyManager.m_rgEnemies.forEach( function( enemy ) {
                enemy.Die( true );
            });
        }
        // zone completion screen
        if ( typeof gGame.m_State.m_VictoryScreen !== 'undefined' ) {
            if ( gGame.m_State.m_VictoryScreen.getChildAt(1).visible || stuck >= maxStuck ) { // 'Continue' button
                gamesDone++; stuck = 0;
                console.log("Finished Sectors: " + gamesDone);
                gGame.ChangeState( new CBattleSelectionState( gGame.m_State.m_PlanetData.id ) );
            }
            else {
              stuck++;
            }
        }
    }, 1500);
})();
