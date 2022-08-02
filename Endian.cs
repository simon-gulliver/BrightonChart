using System;
using System.IO;

namespace Shapefile1
{
    public static class Endian
    {
        public static void Write(BinaryWriter bw, double value)
        {
            byte[] bytes = BitConverter.GetBytes(value);
            Array.Reverse(bytes);
            bw.Write(bytes);
        }
        public static void Write(BinaryWriter bw, Int32 value)
        {
            byte[] bytes = BitConverter.GetBytes(value);
            Array.Reverse(bytes);
            bw.Write(bytes);
        }
        public static void Write(BinaryWriter bw, Int16 value)
        {
            byte[] bytes = BitConverter.GetBytes(value);
            Array.Reverse(bytes);
            bw.Write(bytes);
        }

    }
}



