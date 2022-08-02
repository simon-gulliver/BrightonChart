using System.IO;

namespace Shapefile1
{
    public static class ShapeFormatting
    {
        public delegate void ShapeFormatterDelegate(BinaryWriter bw, string[] values);
        public enum numerical
        {
            compressedDouble, UTM
        };
        ////////////////////////////////////////////////////////////////////////////////////////
        // PolyLine/Polygon
        ////////////////////////////////////////////////////////////////////////////////////////

        public static void Bathy(BinaryWriter bw, string[] values)
        {
            byte colour = 0;
            switch (values[3].Trim())
            {
                case "Depth area": colour = 0; break; // return "#8CF7A5"; break; // green
                case "Depth area <=5m": colour = 0; break; //return "#63D7FF"; break; // dblue
                case "Depth area <=10m": colour = 1; break; //return "#63D7FF"; break; 
                case "Depth area <=20m": colour = 2; break; //return "#C6FFFF"; break;
                case "Depth area <=50m": colour = 2; break; //return "#C6FFFF"; break;
                default: colour = 2; break; //return "#C6FFFF"; break;// lblue
            }
            bw.Write(colour);
        }
        public static void BathyContours(BinaryWriter bw, string[] values)
        {
            bw.Write((byte)double.Parse(values[23])); // szLabel
        }
        public static void LandCoverRegion(BinaryWriter bw, string[] values)
        {
            bw.Write(values[0].Trim());
        }
        public static void LandCoverLine(BinaryWriter bw, string[] values)
        {
            byte colour = 0;
            switch (values[3].Trim())  // "SZFEATURE"
            {
                case "CBLSUB":                              //submarine cable
                case "PIPSOL": colour = 1; break;           //pipeline
                default: break;                             //roads, etc (black)
            }
            bw.Write(colour);
        }
        public static void RoadSpeedLimit(BinaryWriter bw, string[] values)
        {
            var mph = values[10].Trim();
            mph = mph.Substring(0, mph.Length - 3);
            bw.Write((byte)byte.Parse(mph)); // limit_name // also 1 - roadname + coords
        }


        public static void MajorRoads(BinaryWriter bw, string[] values)
        {
            bw.Write(values[1].Trim());
        }

        ////////////////////////////////////////////////////////////////////////////////////////
        // Points
        ////////////////////////////////////////////////////////////////////////////////////////

        public static void Symbols(BinaryWriter bw, string[] values)
        {
            byte image = 0;
            int x, y;
            switch (values[3].Trim())  // "SZFEATDESC"
            {
                case "Buoy, lateral, port-hand lateral mark": image = 41; y = -4; break;
                case "Buoy, lateral, starboard-hand lateral mark": image = 42; y = -4; break;
                case "Beacon, lateral, port-hand lateral mark": image = 74; break;
                case "Beacon, lateral, starboard-hand lateral mark": image = 75; break;
                case "Beacon, cardinal, east cardinal mark": image = 62; break;
                case "Beacon, cardinal, west cardinal mark": image = 64; break;
                case "Beacon, cardinal, south cardinal mark": image = 63; break;
                case "Beacon, cardinal, north cardinal mark": image = 61; break;
                case "Beacon, special purpose/general": image = 90; break;
                case "Beacon, isolated danger": image = 72; break;
                case "Beacon, safe water": image = 80; break;
                case "Beacon, cardinal": image = 60; break;
                case "Buoy, special purpose/general": image = 44; y = -2; break;
                case "Buoy, cardinal, north cardinal mark": image = 11; y = -3; break;
                case "Buoy, cardinal, west cardinal mark": image = 14; y = -3; break;
                case "Buoy, cardinal, east cardinal mark": image = 12; y = -3; break;
                case "Buoy, cardinal, south cardinal mark": image = 13; y = -3; break;
                case "Buoy, safe water": image = 43; y = -2; break;
                case "Buoy, isolated danger": image = 40; y = -4; break;
                case "Topmark, cylinder (can)": image = 19; break;
                case "Topmark, 2 cones (points upward)": image = 25; break;
                case "Topmark, 2 cones (points downward)": image = 26; break;
                case "Topmark, 2 cones, point to point": image = 22; break;
                case "Topmark, 2 cones, base to base": image = 23; break;
                case "Topmark, x-shape (St. Andrew's cross)": image = 21; break;
                case "Topmark, cone, point up": image = 15; break;
                case "Topmark, cone, point down": image = 16; break;
                case "Topmark, square": image = 28; break;
                case "Topmark, sphere": image = 17; break;
                case "Topmark, 2 spheres": image = 18; break;
                case "Topmark, rhombus (diamond)": image = 24; break;
                case "Topmark, triangle, point up": image = 31; break;
                case "Topmark, other shape (see INFORM)": image = 32; break;
                case "Fog signal, reed": image = 67; break;
                case "Fog signal, bell": image = 68; break;
                case "Fog signal, horn": image = 71; break;
                case "Fog signal, siren": image = 66; break;
                case "Fog signal, whistle": image = 69; break;
                case "Fog signal, diaphone": image = 65; break;
                case "Radio station": image = 5; x = 8; break;
                case "Radar station, radar surveillance station": image = 1; x = -1; break;
                case "Radar transponder beacon, racon, radar transponder beacon": image = 2; x = 12; break;
                case "Signal station, warning": image = 9; break;
                case "Signal station, traffic": image = 8; break;
                case "Distance mark, distance mark not physically installed": image = 59; break;
                case "Light vessel": image = 79; x = -1; y = -3; break;
                case "Light": image = 77; y = 3; break;
                case "Wreck": image = 34; break;
                case "Wreck, dangerous wreck": image = 36; break;
                case "Wreck, non-dangerous wreck": image = 35; break;
                case "Wreck, distributed remains of wreck": image = 37; break;
                case "Wreck, wreck showing mast/masts": image = 38; break;
                case "Wreck, wreck showing any portion of hull or superstructure": image = 39; break;
                case "Small craft facility": image = 10; break;

                case "Daymark": image = 57; break;
                case "Light float": image = 78; break;
                case "Topmark, sphere over rhombus": image = 27; break;
                case "Topmark, rectangle, vertical": image = 29; break;
                case "Topmark, trapezium, up": image = 30; break;
                case "Topmark, board": image = 20; break;
                case "Buoy, installation, single buoy mooring (SBM or SPM)": image = 33; break;
                case "Offshore platform": image = 89; break;
                case "Offshore Installation": image = 46; break;
                case "Offshore Installation, Fixed platform/structure": image = 47; break;
                case "Offshore Installation, wellhead": image = 48; break;
                case "Offshore Installation, diffuser": image = 49; break;
                case "Offshore Installation, Wind Turbine": image = 50; break;
                case "Offshore Installation, Turbine Substation": image = 51; break;
                case "Offshore Installation, protection structure": image = 52; break;
                case "Offshore Installation, pipeline structure": image = 53; break;
                case "Offshore Installation, manifold": image = 54; break;
                case "Offshore Installation, storage tank": image = 55; break;
                case "Offshore Installation, template": image = 56; break;
                case "Mooring/Warping facility, bollard": image = 82; break;
                case "Mooring/Warping facility, dolphin": image = 81; break;
                case "Mooring/Warping facility, post or pile": image = 83; break;
                case "Obstruction": image = 84; break;
                case "Obstruction, foul ground": image = 87; break;
                case "Obstruction, ground tackle": image = 88; break;
                case "Obstruction, foul area": image = 86; break;
                case "Fog signal, gong": image = 70; break;
                case "Berth": image = 0; break;
                case "Rescue station": image = 7; break;
                case "Coastguard station": image = 45; break;
                case "Pile": image = 91; break;
                case "Pile, post": image = 56; break;
                case "Offshore Installation, Removed": image = 56; break;
                case "Anchorage area": image = 58; break;
                case "Pilot boarding place": image = 93; break;
                case "Pilot boarding place, boarding by pilot-cruising vessel": image = 93; break;
                case "Harbour facility": image = 72; break;
                case "Recommended traffic lane part": image = 6; break;
                case "Radio calling-in point, inbound": image = 3; break;
                case "Radio calling-in point, two-way": image = 4; break;
                default: image = 56; break; // unknown, need to check out
            }
            bw.Write(image);
        }

        public static void LandCoverPoint(BinaryWriter bw, string[] values)
        {
            byte image = 104; // landmark   
            switch (values[1].Trim())
            {
                case "BUISGL": image = image = 97; break; // "building"; 
                case "FORSTC": image = image = 102; break; //"FortifiedStructure"; 
                case "SILTNK": image = image = 109; break; //"silo"; 
                case "CRANES": image = image = 99; break; //"crane"; 
                case "PYLONS": image = image = 108; break; //"pylon"; 
                case "LNDMRK": break;
                default: break;
            }
            bw.Write(image);
        }

        public static void Geology(BinaryWriter bw, string[] values)
        {
            byte description = 0;
            switch (values[19].Trim())
            {
                case "clay": description = 0; break;
                case "gravel": description = 1; break;
                case "gravel,rock": description = 2; break;
                case "gravel,shells": description = 3; break;
                case "gravel,shells,pebbles": description = 4; break;
                case "mud": description = 5; break;
                case "mud,sand": description = 6; break;
                case "mud,sand,clay": description = 7; break;
                case "mud,shells,gravel,sand": description = 8; break;
                case "mud,shells,pebbles,gravel,sand": description = 9; break;
                case "mud,shells,sand": description = 10; break;
                case "pebbles,shells": description = 11; break;
                case "rock": description = 12; break;
                case "rock,shells": description = 13; break;
                case "sand": description = 14; break;
                case "sand,gravel": description = 15; break;
                case "sand,pebbles": description = 16; break;
                case "sand,pebbles,gravel": description = 17; break;
                case "sand,rock": description = 18; break;
                case "sand,shells": description = 19; break;
                case "sand,shells,gravel": description = 20; break;
                case "sand,shells,pebbles": description = 21; break;
                case "sand,shells,pebbles,gravel": description = 22; break;
                case "sand,shells,stone": description = 23; break;
                default: break;
            }
            bw.Write(description);
        }

    }
}
