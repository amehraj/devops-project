import { expect } from 'chai';
import axios from 'axios';



describe('APIs', function() {
    it('Get running state', async function() {
        const response = await axios.get("http://docker:8083/state")
        expect(response.data).to.equal("RUNNING");
        
    });
    it('Pause ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'application/json' },
        }
        const DATA = {
            "state" : "PAUSED"
        }
        const response = await axios.put("http://docker:8083/state", DATA, HEADER)
        expect(response.data).to.equal("PAUSED");
    });
    it('Get paused state', async function() {
        const response = await axios.get("http://docker:8083/state")
        expect(response.data).to.equal("PAUSED");
    });

    it('Resume ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'application/json' },
        }
        const DATA = {
            "state" : "RUNNING"
        }
        const response = await axios.put("http://docker:8083/state", DATA, HEADER)
        expect(response.data).to.equal("RUNNING");
    });
    it('Get running state', async function() {
        const response = await axios.get("http://docker:8083/state")
        expect(response.data).to.equal("RUNNING");
    });


    it('Get messages log', async function() {
        const response = await axios.get("http://docker:8083/run-log")
        expect(response.data).to.not.equal('');
    });

    it('Get rabbitmq node statistic', async function() {
        const response = await axios.get("http://docker:8083/node-statistic")
        expect(response.data).to.not.equal("");
    });

    it('Get rabbitmq queue statistic', async function() {
        const response = await axios.get("http://docker:8083/queue-statistic")
        expect(response.data).to.not.equal([]);
    });

    it('Init ORIG service', async function() {
        const HEADER = {
            headers: { Accept: 'application/json' },
          }
          const DATA = {
              "state" : "INIT"
          }
          const response = await axios.put("http://docker:8083/state", DATA, HEADER)
          expect(response.data).to.equal("RUNNING");
    });
});