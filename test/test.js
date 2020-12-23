const User = require("../models/User")

describe('User', function() {
    describe('#save()', function() {
      it('should save without error', function(done) {
        var user = new User({
            name: "Alwin",
            verificationType: "OTP",
            password: "12121212",
        });
        user.save(done);
      });
    });
});