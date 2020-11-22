using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Crawler
{
    class Config
    {
        public static List<CrawlProperty> lstProperty = new List<CrawlProperty>();
        public static string MainURL;
        public static string ResultDirectory = "./Results";
        public static int RecordPerFile;
        public static int TotalFile = 1;
        public static int TotalPage;
        public static int StartPage;

        public static bool ReadConfig(string path)
        {
            var xdoc = new XmlDocument();
            if (File.Exists(path))
            {
                xdoc.Load(path);
                MainURL = xdoc.DocumentElement.Attributes["URL"].Value;
                RecordPerFile = int.Parse(xdoc.DocumentElement.Attributes["RECORD_PER_FILE"].Value);
                TotalPage = int.Parse(xdoc.DocumentElement.Attributes["TOTAL_PAGE"].Value);
                StartPage = int.Parse(xdoc.DocumentElement.Attributes["START_PAGE"].Value);
                foreach (XmlNode node in xdoc.DocumentElement.ChildNodes)
                {
                    lstProperty.Add(new CrawlProperty
                    {
                        start = node.Attributes["start"].Value,
                        end = node.Attributes["end"].Value,
                        name = node.Attributes["name"].Value,
                        hasMany = node.Attributes["hasMany"] != null && node.Attributes["hasMany"].Value == "true",
                        substart = node.Attributes["substart"] != null ? node.Attributes["substart"].Value : ""
                    });
                }
                return true;
            }
            return false;
        }
    }
    class CrawlProperty
    {
        public string start { get; set; }
        public string end { get; set; }
        public string name { get; set; }
        public bool hasMany { get; set; }
        public string substart { get; set; }
    }
    class Helper
    {
        public static string ClearHTML(string html)
        {
            var xdoc = new XmlDocument();
            xdoc.LoadXml("<root>" + html + "</root>");
            return xdoc.DocumentElement.InnerText;
        }
    }
}
