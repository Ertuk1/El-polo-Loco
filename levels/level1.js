function initlevel1() {
 level1 = new Level(
    [   new Endboss(Character ),
        new chicken(400),
        new chicken(700),
        new chicken(1000),
        new chicken(1300),
        new chicken(1600),
        new SmallChicken(550),
        new SmallChicken(850),
        new SmallChicken(1150),
        new SmallChicken(1450),
        new SmallChicken(1750),
        
    ],
    [
        new Cloud()
    ],
    [
       /*  new BackgroundObject('IMG/5_background/layers/air.png', -719),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/2.png', -719),
        
        new BackgroundObject('IMG/5_background/layers/air.png', 0),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('IMG/5_background/layers/air.png', 719),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('IMG/5_background/layers/air.png', 719*2),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/1.png', 719*2),
        new BackgroundObject('IMG/5_background/layers/air.png', 719*3),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/2.png', 719*3)
         */


        new BackgroundObject('IMG/5_background/layers/air.png', -719),
        new BackgroundObject('IMG/5_background/layers/air.png', 0),
        new BackgroundObject('IMG/5_background/layers/air.png', 719),
        new BackgroundObject('IMG/5_background/layers/air.png', 719*2),
        new BackgroundObject('IMG/5_background/layers/air.png', 719*3),

        new BackgroundObject('IMG/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('IMG/5_background/layers/3_third_layer/2.png', 719*3),

        new BackgroundObject('IMG/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('IMG/5_background/layers/2_second_layer/2.png', 719*3),
        
        

        new BackgroundObject('IMG/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/2.png', -719),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/2.png', 719),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/1.png', 719*2),
        new BackgroundObject('IMG/5_background/layers/1_first_layer/2.png', 719*3),

                

        


        


        
        
        
        
        
        
        
        
        
    ]
);
}
