using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Crawler
{
    class HttpService
    {
        public static async Task<string> GetAsync(string uri)
        {
            var request = (HttpWebRequest)WebRequest.Create(uri);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (var response = (HttpWebResponse)await request.GetResponseAsync())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                return await reader.ReadToEndAsync();
            }
        }
        public static List<string> GetDetail_URLs(string pageURL)
        {
            var content = HttpService.GetAsync(pageURL).Result;
            content = content.Substring(content.IndexOf(Config.lstProperty[0].start));
            content = content.Substring(0, content.IndexOf(Config.lstProperty[0].end) + Config.lstProperty[0].end.Length);
            var lst = new List<string>();
            while (content.IndexOf(Config.lstProperty[1].start) > 0)
            {
                content = content.Substring(content.IndexOf(Config.lstProperty[1].start) + Config.lstProperty[1].start.Length);
                var link = content.Substring(0, content.IndexOf(Config.lstProperty[1].end));
                if (!lst.Contains(link)) lst.Add(link);
            }
            return lst;
        }

        public static JSON GetDetailPage(string pageURL)
        {
            var content = HttpService.GetAsync(pageURL).Result;
            content = content.Substring(content.IndexOf(Config.lstProperty[2].start));
            content = content.Substring(0, content.IndexOf(Config.lstProperty[2].end) + Config.lstProperty[2].end.Length);
            var json = new JSON();
            for (int i = 3; i < Config.lstProperty.Count; i++)
            {
                var propValue = "";
                if (Config.lstProperty[i].hasMany)
                {
                    var multiValue = "";
                    while (content.IndexOf(Config.lstProperty[i].start) >= 0)
                    {
                        content = Trim(Config.lstProperty[i], content);
                        multiValue += content.Substring(0, content.IndexOf(Config.lstProperty[i].end)) + ";";
                    }
                    propValue = multiValue;
                }
                else
                {
                    content = Trim(Config.lstProperty[i], content);
                    propValue = content.Substring(0, content.IndexOf(Config.lstProperty[i].end));
                }
                json.add_property(Config.lstProperty[i].name, propValue);
            }
            return json;
        }

        static string Trim(CrawlProperty crawl, string content)
        {
            content = content.Substring(content.IndexOf(crawl.start) + crawl.start.Length);
            if (!string.IsNullOrEmpty(crawl.substart))
                content = content.Substring(content.IndexOf(crawl.substart) + crawl.substart.Length);

            return content;
        }
    }
}
