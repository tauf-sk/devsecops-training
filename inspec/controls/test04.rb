# control 'passwd-file-permissions' do
#   impact 1.0
#   title '/etc/passwd permissions should not exceed 644'
#   desc 'The /etc/passwd file must have permissions that are no more permissive than 0644.'

#   describe file('/etc/passwd') do
#     it { should exist }
#     # Ensure the file mode (octal) is less than or equal to 0644.
#     its('mode') { should cmp <= 0644 }
#   end
# end

# control 'shadow-file-permissions' do
#   impact 1.0
#   title '/etc/shadow permissions should not exceed 400'
#   desc 'The /etc/shadow file must have permissions that are no more permissive than 0400.'

#   describe file('/etc/shadow') do
#     it { should exist }
#     # Ensure the file mode (octal) is less than or equal to 0400.
#     its('mode') { should cmp <= 0400 }
#   end
# end

# control 'npm-not-running-as-root' do
#   impact 1.0
#   title 'npm service should not be running as root'
#   desc 'The npm service, if running, must not run as the root user in order to mitigate security risks.'

#   # Check all processes with "npm" in the command name.
#   describe processes('npm') do
#     its('users') { should_not include 'root' }
#   end
# end
