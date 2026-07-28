import {describe,it,expect} from "vitest";
import {generateEDSL} from "../src";


describe("EDSL Generator",()=>{


it("generates EDSL from AI schema",()=>{


const edsl=generateEDSL({

design:{
name:"DOL Starter",
application:"motor_control"
},

components:[

{
id:"M1",
type:"IEC-MOTOR-3PH",
description:"Motor",
category:"load"
}

],

connections:[]

});


expect(edsl)
.toContain("component M1");


});


});