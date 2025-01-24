import requests
import os
from dotenv import load_dotenv
from api.functions.get_location_info import *


load_dotenv()

def get_airports(search_string):
    
    valid_airports = [
        'JNB', 'CAI', 'ADD', 'NBO', 'CPT', 'ALG', 'CMN', 'LOS', 'RAK', 'DAR', 'ZNZ', 'ABV', 'TUN', 'ACC', 'HRG', 'DUR', 'SSH', 'ARK', 'ABJ', 'LUN', 'MBA', 'EBB', 'DSS', 'HRE', 'LAD', 'MRU', 'KGL', 'SEZ', 'AGA', 'ORN', 'MPM', 'JRO', 'MJI', 'WIL', 'TNG', 'DLA', 'PLZ', 'LBV', 'LFW', 'SEU', 'PRI', 'TNR', 'RUN', 'RBA', 'KAN', 'HBE', 'FIH', 'BJR', 'BKO', 'NSI', 'CZL', 'FEZ', 'KIS', 'MGQ', 'PHC', 'GBE', 'WDH', 'ASW', 'SID', 'VFA', 'KMS', 'MQX', 'RAI', 'BEN', 'BFN', 'PZU', 'OUA', 'DJE', 'COO', 'EDL', 'NLA', 'MQP', 'LKY', 'BZV', 'GRJ', 'HLA', 'JIJ', 'GDQ', 'ELS', 'UKA', 'DIR', 'OUD', 'RMF', 'PNR', 'MYD', 'DZA', 'CKY', 'BNI', 'LXR', 'TML', 'NDR', 'SSG', 'RRG', 'MUB', 'AAE', 'JIB', 'BEW', 'ENU', 'BVC', 'BUQ', 'CAN', 'PVG', 'HND', 'DEL', 'PEK', 'TFU', 'DXB', 'SZX', 'IST', 'CGK', 'KMG', 'ICN', 'PKX', 'SIN', 'CKG', 'XIY', 'BKK', 'KUL', 'HGH', 'BOM', 'MNL', 'SHA', 'HKG', 'BLR', 'WUH', 'JED', 'NKG', 'CGO', 'HAK', 'RUH', 'DOH', 'CSX', 'TPE', 'DMK', 'SGN', 'HYD', 'XMN', 'NRT', 'CTU', 'TAO', 'URC', 'FUK', 'HRB', 'SAW', 'KIX', 'SHE', 'CJU', 'KWE', 'MAA', 'HAN', 'SYX', 'AUH', 'TNA', 'CCU', 'DLC', 'DPS', 'CTS', 'TSN', 'CGQ', 'KTM', 'OKA', 'ITM', 'GMP', 'FOC', 'LHW', 'HET', 'TYN', 'NGB', 'CEB', 'SUB', 'DAC', 'HFE', 'PUS', 'HKT', 'WNZ', 'SHJ', 'ZUH', 'AYT', 'KWI', 'KHN', 'AMD', 'UPG', 'NGO', 'DMM', 'SJW', 'YNT', 'NNG', 'SWA', 'MCT', 'THR', 'WUX', 'TLV', 'COK', 'BAH', 'INC', 'JJN', 'KOJ', 'ESB', 'JHG', 'CNX', 'AMS', 'LHR', 'MAD', 'CDG', 'FRA', 'BCN', 'MUC', 'FCO', 'VIE', 'DUB', 'CPH', 'SVO', 'ATH', 'OSL', 'LGW', 'ZRH', 'LIS', 'STN', 'MXP', 'ORY', 'MAN', 'BER', 'LPA', 'BRU', 'LED', 'ARN', 'HEL', 'WAW', 'VKO', 'AGP', 'GVA', 'PMI', 'BUD', 'DUS', 'OTP', 'EDI', 'ALC', 'TFS', 'PRG', 'TFN', 'DME', 'HAM', 'BGY', 'LIN', 'BGO', 'LTN', 'OPO', 'LYS', 'OVB', 'ACE', 'NCE', 'MRS', 'SXM', 'KRK', 'VLC', 'BEG', 'BHX', 'AER', 'SVQ', 'SVX', 'BLQ', 'CTA', 'CRL', 'VCE', 'TLS', 'RIX', 'LCY', 'GLA', 'FUE', 'TRD', 'TIA', 'STR', 'SOF', 'BRS', 'MLA', 'BSL', 'CGN', 'SVG', 'LUX', 'BIO', 'NAP', 'SKG', 'KEF', 'PMO', 'TOS', 'NTE', 'ZAG', 'GDN', 'BRI', 'BFS', 'BOO', 'GOT', 'KZN', 'EIN', 'IKT', 'KJA', 'COV', 'BOD', 'BVA', 'TRN', 'ORD', 'DFW', 'ATL', 'DEN', 'CLT', 'LAX', 'IAH', 'EWR', 'BOS', 'JFK', 'PHX', 'LAS', 'LGA', 'SFO', 'YYZ', 'SEA', 'MIA', 'DCA', 'MCO', 'DTW', 'PHL', 'MSP', 'MEX', 'IAD', 'YVR', 'SLC', 'FLL', 'YUL', 'BNA', 'SAN', 'HNL', 'CUN', 'AUS', 'BWI', 'YYC', 'PTY', 'TPA', 'PDX', 'RDU', 'GDL', 'STL', 'MDW', 'SMF', 'SJU', 'BZE', 'MTY', 'PIT', 'CVG', 'MCI', 'IND', 'CMH', 'SJC', 'DAL', 'MSY', 'CLE', 'TIJ', 'SAT', 'HOU', 'SNA', 'OGG', 'OAK', 'SJO', 'YOW', 'YEG', 'NLU', 'CHS', 'BUR', 'MKE', 'BOI', 'JAX', 'RIC', 'RSW', 'MEM', 'BDL', 'ABQ', 'SDF', 'SPR', 'ONT', 'YTZ', 'ANC', 'YHZ', 'OKC', 'BUF', 'ORF', 'SDQ', 'PBI', 'PUJ', 'TYS', 'GUA', 'OMA', 'RNO', 'SAL', 'YWG', 'BHM', 'SJD', 'MYR', 'GEG', 'PVD', 'SAV', 'TUL', 'SYD', 'MEL', 'BNE', 'AKL', 'PER', 'WLG', 'CHC', 'ADL', 'CNS', 'CBR', 'OOL', 'POM', 'NAN', 'TSV', 'NSN', 'HBA', 'DRW', 'ZQN', 'PPT', 'BHE', 'NPE', 'GUM', 'NTL', 'TRG', 'HID', 'PMR', 'MKY', 'LST', 'MCY', 'NPL', 'SUV', 'DUD', 'ROK', 'DBO', 'BOB', 'HLZ', 'WGA', 'LAE', 'PLO', 'RFP', 'CFS', 'HGU', 'KTA', 'VLI', 'ROT', 'GIS', 'PHE', 'PMK', 'RAR', 'TBU', 'IVC', 'ABX', 'AVV', 'PQQ', 'MQL', 'BME', 'OAG', 'ISA', 'BNK', 'ASP', 'RAB', 'BWT', 'ZNE', 'BDB', 'PPP', 'KNX', 'TRW', 'TMW', 'DPO', 'KGI', 'KKE', 'MGB', 'WWK', 'MAG', 'HIR', 'LBS', 'AIT', 'HTI', 'KNS', 'MIM', 'WRE', 'GEA', 'FGI', 'KUG', 'ARM', 'RMA', 'BDD', 'TVU', 'SVU', 'HUH', 'GLT', 'GET', 'EMD', 'PBO', 'SPN', 'MOV', 'GKA', 'HVB', 'AYQ', 'GFF', 'BOG', 'GRU', 'LIM', 'CGH', 'SCL', 'AEP', 'VCP', 'MDE', 'BSB', 'CNF', 'GIG', 'REC', 'EZE', 'CLO', 'SDU', 'CTG', 'UIO', 'SSA', 'CWB', 'GYE', 'EOH', 'CCS', 'VVI', 'FOR', 'BEL', 'POA', 'SMR', 'CUZ', 'CBB', 'FLN', 'BAQ', 'LPB', 'PEI', 'GYN', 'MAO', 'BGA', 'COR', 'VIX', 'ADZ', 'CGB', 'MDZ', 'CUC', 'AQP', 'MCZ', 'MVD', 'MTR', 'NAT', 'NVT', 'ASU', 'BPS', 'BRC', 'SLZ', 'PMV', 'IGU', 'RAO', 'GEO', 'UIB', 'AJU', 'IGR', 'UDI', 'TPP', 'JPA', 'CGR', 'SLA', 'ANF', 'NQN', 'IQT', 'PSO', 'SJP', 'CJC', 'LSC', 'AXM', 'MGF', 'THE', 'USH', 'CCP', 'FEN', 'RRJ', 'PIU', 'EYP', 'APO', 'FTE', 'TRU', 'PMC', 'CIX', 'JUL', 'NVA', 'RCH', 'PCL', 'MAR', 'CUE', 'SRE', 'TDD', 'PMW', 'PVH', 'LDB', 'IQQ', 'TUC', 'CRD', 'VVC'
    ]
    
    rapidapi_key = os.getenv('RAPIDAPI_VINCE')
    url = "https://aviation-reference-data.p.rapidapi.com/airports/search"

    search_string_loc_info = get_location_info(search_string)
    lat = search_string_loc_info[0]
    long = search_string_loc_info[1]


    querystring = {"lat": lat, "lon": long, "radius":"50"}

    headers = {
    	"x-rapidapi-key": rapidapi_key,
    	"x-rapidapi-host": "aviation-reference-data.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    try:
        response.raise_for_status()  # Raise an error for bad responses
        airport_data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        airport_data = {"error": str(e)}
        
    if airport_data and isinstance(airport_data, list):
        airport_code = None  # Initialize to None
        for airport in airport_data:
            iata_code = airport.get('iataCode')
            if iata_code in valid_airports:
                airport_code = iata_code
                print(airport_code)
                return airport_code


