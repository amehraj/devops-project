import { expect } from 'chai';
import axios from 'axios';



describe('APIs', function() {
    //Check if the system is running and messages are being sent
    it('Get running state', async function() {
        const response = await axios.get("http://docker:8083/state")
        expect(response.data).to.equal("RUNNING");
        
    });
    //Pause the service
    it('Pause ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'text/plain', 'Content-Type': "text/plain" },
        }
        const DATA = "PAUSED"
        const response = await axios.put("http://docker:8083/state", DATA, HEADER)
        expect(response.data).to.equal("PAUSED");
    });
    //Check the state during the pause
    it('Get paused state', async function() {
        const response = await axios.get("http://docker:8083/state")
        expect(response.data).to.equal("PAUSED");
    });
    //Resume the service again
    it('Resume ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'text/plain', 'Content-Type': "text/plain" },
        }
        const DATA = "RUNNING"
        const response = await axios.put("http://docker:8083/state", DATA, HEADER)
        expect(response.data).to.equal("RUNNING");
    });
    //Check the state after resuming
    it('Get running state after resume', async function() {
        const response = await axios.get("http://docker:8083/state")
        expect(response.data).to.equal("RUNNING");
    });

    //Get message logs for the application
    it('Get messages log', async function() {
        const response = await axios.get("http://docker:8083/run-log")
        expect(response.data).to.not.equal('');
    });
    //Get node statistics, top 5 stats
    it('Get rabbitmq node statistic', async function() {
        const response = await axios.get("http://docker:8083/node-statistic")
        expect(response.data).to.not.equal("");
    });
    //Get queue statistic for each queue
    it('Get rabbitmq queue statistic', async function() {
        const response = await axios.get("http://docker:8083/queue-statistic")
        expect(response.data).to.not.equal([]);
    });
    //Get all the messages what were written in the file
    it('Get messages', async function() {
        const HEADER = {
            headers: { Accept: 'text/plain', 'Content-Type': "text/plain" },
        }
        const response = await axios.get("http://docker:8083/messages", HEADER)
        expect(response.data).to.not.equal('');
    });

});