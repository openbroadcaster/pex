#!/usr/bin/env python
import os
import sys
import subprocess

try:
  import pysox;
except ImportError:
  print 'requires pysox module';
  sys.exit()

 # Set default parameters
minsamplerate = 44100.0
minprecision = 16


def assemble(ftype,fpath, catfiles):
	d = os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','..','assets/uploads')
        fname = os.path.join(d,fpath)
	try:
	  id = pysox.ConcatenateFiles('input',catfiles)
	except:
          #print 'Concat fail' 
	  sys.exit(1);
        try:
          outfile = pysox.CSoxStream(fname,'w',id.get_out_signal(),fileType=ftype)
          chain = pysox.CEffectsChain(ostream=outfile)
          chain.add_effect(id)
          chain.flow_effects()
	except:
          #print 'Write fail' 
	  sys.exit(1);
	duration = subprocess.check_output(["soxi", "-D",fname])
        outfile.close()
        print duration 

def main(argv):
  if len(argv) <=3:
      print 'Insufficient parameters'
      sys.exit(1);
  com = argv.pop(0)
  path = argv.pop(0)
  ftype = 'wav'
  return assemble(ftype, path, argv)

if __name__ == '__main__':
  sys.exit(main(sys.argv))


sys.exit();
