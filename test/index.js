// main test entry point

const chai = require("chai");

describe("Main", function(){
  
  it("should be sane", function(){
    chai.expect(true).is.true;
    chai.expect(false).is.false;
  });
  
  it("should be not insane", function(){
    chai.expect(true).is.not.false;
    chai.expect(false).is.not.true;
  });
  
});
