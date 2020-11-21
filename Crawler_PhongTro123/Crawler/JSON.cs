using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Crawler
{
    class JSON
    {
        List<JsonProperty> props = new List<JsonProperty>();
        public void add_property(string key, string value)
        {
            props.Add(new JsonProperty
            {
                key = key,
                value = value
            });
        }
        public string toJsonString()
        {
            var json = "";
            foreach(var item in props)
            {
                json += $"\"{item.key}\":\"{item.value.Replace("\"", "&quot;")}\",";
            }
            return "{" + json.Remove(json.Length - 1) + "}";
        }

        public static void WriteFile(List<JSON> lst)
        {
            var jsonString = "";
            var count = 1;
            Directory.CreateDirectory(Config.ResultDirectory);
            for (int i = 0; i < lst.Count; i++)
            {
                jsonString += lst[i].toJsonString() + ",";
                if (i + 1 == Config.RecordPerFile * count)
                {
                    File.WriteAllText($"{Config.ResultDirectory}/data_{count}.json", "[" + jsonString.Remove(jsonString.Length - 1) + "]");
                    Console.Write(count + " ");
                    count++;
                    jsonString = "";
                }
            }
            if (jsonString != "")
            {
                File.WriteAllText($"{Config.ResultDirectory}\\data_{count}.json", "[" + jsonString.Remove(jsonString.Length - 1) + "]");
                Console.Write(count);
            }
        }
    }

    class JsonProperty
    {
        public string key { get; set; }
        public string value { get; set; }
    }
}
