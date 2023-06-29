using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace receive
{
    public class operationSchema
    {
        public string _id { get; set; }
        public Decimal number1 { get; set; }
        public Decimal number2 { get; set; }
        public Decimal result { get; set; }
        public string calculationStatus { get; set; }

        public operationSchema()
        {
            _id = string.Empty;
            number1 = 0;
            number2 = 0;
            result = 0;
            calculationStatus = string.Empty;
        }
    }
}
