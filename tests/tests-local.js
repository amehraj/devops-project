import { expect } from 'chai';
import axios from 'axios';

describe('APIs', function() {
    it('Get running state', async function() {
        const response = await axios.get("http://localhost:8083/state")
        expect(response.data).to.equal("RUNNING");
        
    });
    it('Pause ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'application/json' },
        }
        const DATA = {
            "state" : "PAUSED"
        }
        const response = await axios.put("http://localhost:8083/state", DATA, HEADER)
        console.log(response)
        expect(response.data).to.equal("PAUSED");
    });
    it('Get paused state', async function() {
        const response2 = await axios.get("http://localhost:8083/state")
        console.log(response2)
        expect(response2.data).to.equal("PAUSED");
    });

    it('Resume ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'application/json' },
        }
        const DATA = {
            "state" : "RUNNING"
        }
        const response = await axios.put("http://localhost:8083/state", DATA, HEADER)
        console.log(response)
        expect(response.data).to.equal("RUNNING");
    });
    it('Get running state', async function() {
        const response2 = await axios.get("http://localhost:8083/state")
        console.log(response2)
        expect(response2.data).to.equal("RUNNING");
    });
});