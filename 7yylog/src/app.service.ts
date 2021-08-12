import { Injectable, HttpException } from '@nestjs/common';
import * as elasticsearch from 'elasticsearch';
require('dotenv').config();

@Injectable()
export class AppService {
  private readonly esclient: elasticsearch.Client;

  constructor() {
    this.esclient = new elasticsearch.Client({
      host: `${process.env.ELASTIC_CONNECTION}`,
    });
    this.esclient.ping({ requestTimeout: 3000 })
        .catch(err => {
          throw new HttpException({
            status: 'error',
            message: 'Unable to reach Elasticsearch cluster'
          }, 500);
        });
  }
  async bulkInsert(logs_data, dataType: string) {
    const bulk = [];
    for (const log_key in logs_data) {
      bulk.push({
        index: {
          _index: 'solomon_log',
          _type: dataType
        }
      });
      // bulk.push(logs_data[log_key])
      bulk.push({
        user_uid: logs_data[log_key].user_uid,
        table_name: logs_data[log_key].table_name,
        action: logs_data[log_key].action,
        logged_at: logs_data[log_key].logged_at,
        old_value: logs_data[log_key].old_value,
        new_value: logs_data[log_key].new_value,
        status: logs_data[log_key].status,
        login_id: logs_data[log_key].login_id,
        unique_target: logs_data[log_key].unique_target
      });
    }
    return await this.esclient.bulk({
      body: bulk,
      index: 'solomon_log',
      type: dataType
    })
        .then(res => ({status: 'success', data: res}))
        .catch(err => { throw new HttpException(err, 500); });
  }

  // searches the 'pokemons' index for matching documents
  async searchIndex(q: string) {
    const body = {
      size: 200,
      from: 0,
      query: {
        match: {
          user_uid: q,
        },
      },
    };
    return await this.esclient.search({index: 'pokemons', body, q})
        .then(res => res.hits.hits)
        .catch(err => { throw new HttpException(err, 500); });
  }
  getHello(): string {
    return 'Hello World!';
  }
}
