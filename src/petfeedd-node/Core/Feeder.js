const bus = require("../event-bus");
const Gpio = require("pigpio").Gpio;
const mqtt = require("../Core/mqtt");
const config = require("../config");
const database = require("../database");

const Library = require("./Library");

class Feeder extends Library {
  constructor(database) {
    super();
    this.database = database;
  }

  async run() {
    this.logger.info("Listening for feeds.");
    bus.on("feed", (...args) => this.feed(...args));
  }

  async feed(feedData) {
    let isPaused = parseInt(await config.getConfigEntry("general", "paused"));
    if (isPaused) {
      this.logger.warning("Avoiding a feed because we are paused.");
      return;
    }

    try {
      let motor = new Gpio(feedData.pin, {
        mode: Gpio.OUTPUT,
      });

      motor.servoWrite(2500);
      await sleep(feedData.time * feedData.size * 1000);
      motor.servoWrite(0);

      mqtt.publish(feedData.size);
    } catch (error) {
      this.logger.error("Could not enable GPIO.");
    }

    var feedName = feedData.name || "Received";
    if (feedData.feed) {
      var feed = feedData.feed;
      feed.feed_count++;
      feed.last_feed = new Date();
      feed.save();

      feedName = feed.name;
    }

    let FeedEvent = this.database.modelFactory("FeedEvent");
    if (feedData.onDemand) {
      feedName += " (On Demand)";
    }

    let f = await FeedEvent.create({
      name: feedName,
      size: feedData.size,
    });

    bus.emit("feed.completed", f);
  }
}

module.exports = new Feeder(database);
