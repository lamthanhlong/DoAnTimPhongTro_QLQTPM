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
            var lst = new List<string>();
            try
            {
                var content = HttpService.GetAsync(pageURL).Result;
                if (string.IsNullOrEmpty(content))
                {
                    Config.lstError.Add(new CrawlerError
                    {
                        URL = pageURL,
                        Message = "Can't get HTML"
                    });
                    return lst;
                }
                content = content.Substring(content.IndexOf(Config.lstProperty[0].start));
                content = content.Substring(0, content.IndexOf(Config.lstProperty[0].end) + Config.lstProperty[0].end.Length);

                while (content.IndexOf(Config.lstProperty[1].start) > 0)
                {
                    content = content.Substring(content.IndexOf(Config.lstProperty[1].start) + Config.lstProperty[1].start.Length);
                    var link = content.Substring(0, content.IndexOf(Config.lstProperty[1].end));
                    if (!lst.Contains(link)) lst.Add(link);
                }
            }
            catch (Exception ex)
            {
                Config.lstError.Add(new CrawlerError
                {
                    URL = pageURL,
                    Message = ex.Message.Trim()
                });
            }
            return lst;
        }

        public static JSON GetDetailPage(string pageURL)
        {
            var json = new JSON();
            try
            {
                var content = HttpService.GetAsync(pageURL).Result;
                if (string.IsNullOrEmpty(content))
                {
                    Config.lstError.Add(new CrawlerError
                    {
                        URL = pageURL,
                        Message = "Can't get HTML"
                    });
                    return json;
                }
                content = content.Substring(content.IndexOf(Config.lstProperty[2].start));
                content = content.Substring(0, content.IndexOf(Config.lstProperty[2].end) + Config.lstProperty[2].end.Length);

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
                        if (content.IndexOf(Config.lstProperty[i].start) >= 0)
                        {
                            content = Trim(Config.lstProperty[i], content);
                            propValue = content.Substring(0, content.IndexOf(Config.lstProperty[i].end));
                        }
                    }
                    if (Config.lstProperty[i].isRequired && propValue == "")
                    {
                        Config.lstError.Add(new CrawlerError
                        {
                            URL = pageURL,
                            Message = "Page didn't have necessary information"
                        });
                        return new JSON();
                    }
                    json.add_property(Config.lstProperty[i].name, Helper.ClearInvalidCharacters(propValue.Trim()));
                }
            }
            catch (Exception ex)
            {
                Config.lstError.Add(new CrawlerError
                {
                    URL = pageURL,
                    Message = ex.Message.Trim()
                });
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
