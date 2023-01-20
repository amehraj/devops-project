import { expect } from 'chai';
import axios from 'axios';



describe('APIs', function() {
    it('Get running state', async function() {
        const response = await axios.get("http://localhost:8083/state")
        console.log(response.data)
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
        console.log(response.data)
        expect(response.data).to.equal("PAUSED");
    });
    it('Get paused state', async function() {
        const response = await axios.get("http://localhost:8083/state")
        console.log(response.data)
        expect(response.data).to.equal("PAUSED");
    });

    it('Resume ORIG service', async function() {
        const HEADER = {
          headers: { Accept: 'application/json' },
        }
        const DATA = {
            "state" : "RUNNING"
        }
        const response = await axios.put("http://localhost:8083/state", DATA, HEADER)
        console.log(response.data)
        expect(response.data).to.equal("RUNNING");
    });
    it('Get running state', async function() {
        const response = await axios.get("http://localhost:8083/state")
        console.log(response.data)
        expect(response.data).to.equal("RUNNING");
    });

    it('Get rabbitmq node statistic', async function() {
        const response = await axios.get("http://localhost:8083/node-statistic")
        console.log(response.data)
        expect(response.data).to.not.equal("");
    });

    it('Get rabbitmq queue statistic', async function() {
        const response = await axios.get("http://localhost:8083/queue-statistic")
        console.log(response.data)
        expect(response.data).to.not.equal("");
    });

    // it('Get rabbitmq node statistic', async function() {
    //     let data = ''
    //     axios
    //       .get('http://localhost:15672/api/nodes', {
    //         auth: {
    //              username: "guest",
    //              password: "guest",
    //         }
    //     })
    //       .then((response) => {
    //           console.log('Req body:', response.data)
    //           console.log('Req header :', response.headers)
    //           data = response.data
    //           const jsonObject = data[0]
    //           console.log(jsonObject)
    //           const statistics_data = { "fd_used" : jsonObject.fd_used,  "sockets_used" : jsonObject.sockets_used, "disk_free" : jsonObject.disk_free, "connection_created" : jsonObject.connection_created, "channel_created": jsonObject.channel_created}
    //           console.log(statistics_data)
    //       })
    //       .catch((e) => {
    //         console.error(e)
    //       })
    // });
});