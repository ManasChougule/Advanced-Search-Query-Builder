import http.client
import json
from constant import MEASUREMENTS_CACHE_FIELDS
from datetime import datetime
from datetime import datetime

class SolarSuggestions:

    def get_field_values(self, field_name, selected_networks,prefix_value):
        conn = http.client.HTTPConnection("localhost", 8983)
        total_hashtags = []
        value_limit = 21  # limit 20 + 1
        if(field_name=='sourceFileRecordingTime'):
            currentTime = datetime.now()
            current_time_string  = currentTime.strftime("%Y-%m-%dT%H:%M:%SZ")
            return [current_time_string]
        
        for network in selected_networks:
            path = (
                f"/solr/Knooble/select?"
                f"q=network_location:{network}"
                f"&rows=0"  
                f"&facet=true"
                f"&facet.field={field_name}"
                f"&facet.limit={value_limit}"
                f"&facet.contains={prefix_value}"
                f"&facet.contains.ignoreCase=true"
                f"&wt=json"
            )
            
            try:
                conn.request("GET", path)
                response = conn.getresponse()
                
                if response.status != 200:
                    print(f"Error fetching data for network {network}: HTTP {response.status}")
                    continue 
                
                response_data = response.read().decode('utf-8')
                cache_last_update_data = json.loads(response_data)
                
                facet_fields = cache_last_update_data.get('facet_counts', {}).get('facet_fields', {})
                field_values = facet_fields.get(field_name, [])
                values = field_values[::2] 
                total_hashtags.extend(values)
                
            except Exception as e:
                print(f"Exception occurred while fetching data for network {network}: {e}")
                continue
        
        conn.close()
        return total_hashtags

    def get_field_data(self,field_name,selected_networks,prefix_value,is_field=True):
        if is_field:
                field_data = MEASUREMENTS_CACHE_FIELDS
                try:
                    matched_data = [cache_files for cache_files in field_data if field_name in cache_files]
                except :
                     matched_data = field_data
                return matched_data
        elif not is_field:
                field_data = self.get_field_values(field_name, selected_networks,prefix_value)
                if field_name.endswith('Time'):
                        field_data = [datetime.strptime(time, "%Y-%m-%dT%H:%M:%SZ").strftime("%Y-%m-%d %H:%M:%S") for time in field_data]
                        return field_data
        field_data = [value for value in field_data if isinstance(value, str)]
        return field_data
    
    # def get_hashtag_Suggestions(self, selected_networks):
    #     conn = http.client.HTTPConnection("localhost", 8983)
    #     total_hashtags = []
    #     for network in selected_networks:
    #         path = f"/solr/Knooble/select?fl=hashtags&indent=on&q=network_location:{network}&wt=json"
    #         conn.request("GET", path)
    #         response = conn.getresponse()
    #         if response.status == 200:
    #             cache_last_update_data = json.loads(response.read().decode())
    #             values = cache_last_update_data["response"]["docs"][0]["hashtags"]
    #             total_hashtags.extend(values)
    #     return total_hashtags

    # def get_locations_wise_hashtags(self):
    #     conn = http.client.HTTPConnection("localhost", 8983)
    #     path = f"/solr/Knooble/select?fl=hashtags,network_location&indent=on&q=network_location:*&wt=json"
    #     conn.request("GET", path)
    #     response = conn.getresponse()
    #     if response.status == 200:
    #         cache_last_update_data = json.loads(response.read().decode())
    #         values = cache_last_update_data["response"]["docs"]
    #         return values