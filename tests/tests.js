import { expect } from 'chai';
import axios from 'axios';



describe('APIs', function() {
    it('Get running state', async function() {
        const response = await axios.get("http://docker:8083/state")
        console.log(response.data)
        expect(response.data).to.equal("RUNNING");
        
    });
    it('Pause ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'text/plain', 'Content-Type': "text/plain" },
        }
        const DATA = "PAUSED"
        const response = await axios.put("http://docker:8083/state", DATA, HEADER)
        console.log(response.data)
        expect(response.data).to.equal("PAUSED");
    });
    it('Get paused state', async function() {
        const response = await axios.get("http://docker:8083/state")
        console.log(response.data)
        expect(response.data).to.equal("PAUSED");
    });

    it('Resume ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'text/plain', 'Content-Type': "text/plain" },
        }
        const DATA = "RUNNING"
        const response = await axios.put("http://docker:8083/state", DATA, HEADER)
        console.log(response.data)
        expect(response.data).to.equal("RUNNING");
    });
    it('Get running state', async function() {
        const response = await axios.get("http://docker:8083/state")
        console.log(response.data)
        expect(response.data).to.equal("RUNNING");
    });


    it('Get messages log', async function() {
        const response = await axios.get("http://docker:8083/run-log")
        console.log(response.data)
        expect(response.data).to.not.equal('');
    });

    it('Get rabbitmq node statistic', async function() {
        const response = await axios.get("http://docker:8083/node-statistic")
        console.log(response.data)
        expect(response.data).to.not.equal("");
    });

    it('Get rabbitmq queue statistic', async function() {
        const response = await axios.get("http://docker:8083/queue-statistic")
        console.log(response.data)
        expect(response.data).to.not.equal([]);
    });

    it('Get messages', async function() {
        const response = await axios.get("http://docker:8083/messages")
        console.log(response.data)
        expect(response.data).to.not.equal('');
    });

});